'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch } from '@shared/store/hooks';
import { setToken, setLoading } from '@modules/auth/store/authSlice';
import { setUser } from '@modules/auth/store/profileSlice';
import { apiConnector } from '@shared/services/apiConnector';
import { profileEndpoints } from '@shared/services/apis';
import toast from 'react-hot-toast';

interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  image?: string;
  accountType?: string;
  [key: string]: unknown;
}

interface TokenPayload {
  email?: string;
  id?: string;
  accountType?: string;
  iat?: number;
  exp?: number;
  [key: string]: unknown;
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processAuth = async () => {
      try {
        const token = searchParams.get('token');
        const error = searchParams.get('error');
        const success = searchParams.get('success');

        if (error) {
          const errorMessage = decodeURIComponent(error);
          toast.error(errorMessage || 'Error en la autenticación con Google');
          router.replace(`/auth/login?error=${encodeURIComponent(errorMessage)}`);
          return;
        }

        if (!token || success !== 'true') {
          toast.error('Error: No se recibió el token de autenticación');
          router.replace('/auth/login?error=no_token');
          return;
        }

        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
          toast.error('Error: Formato de token inválido');
          router.replace('/auth/login?error=invalid_token');
          return;
        }

        let payload: TokenPayload;
        try {
          payload = JSON.parse(atob(tokenParts[1]));
        } catch (e) {
          toast.error('Error: No se pudo decodificar el token');
          router.replace('/auth/login?error=token_decode_error');
          return;
        }

        if (payload.exp && payload.exp * 1000 < Date.now()) {
          toast.error('Error: El token ha expirado');
          router.replace('/auth/login?error=token_expired');
          return;
        }

        dispatch(setToken(token));
        localStorage.setItem('token', JSON.stringify(token));
        dispatch(setLoading(true));
        try {
          const response = await apiConnector<{
            success: boolean;
            data?: UserData;
          }>(
            'GET',
            profileEndpoints.GET_USER_DETAILS_API,
            undefined,
            { Authorization: `Bearer ${token}` }
          );

          if (!response.data.success || !response.data.data) {
            throw new Error('No se pudieron obtener los detalles del usuario');
          }

          const userData = response.data.data;
          const userImage = userData.image
            ? userData.image
            : `https://api.dicebear.com/5.x/initials/svg?seed=${userData.firstName} ${userData.lastName}`;

          const userWithImage = { ...userData, image: userImage };

          dispatch(setUser(userWithImage));
          localStorage.setItem('user', JSON.stringify(userWithImage));
          dispatch(setLoading(false));

          toast.success('Autenticación exitosa');
          router.replace('/dashboard/my-profile');
        } catch (apiError) {
          console.error('Error obteniendo detalles del usuario:', apiError);
          toast.error('Error al obtener los datos del usuario');
          dispatch(setLoading(false));
          localStorage.removeItem('token');
          dispatch(setToken(null));
          router.replace('/auth/login?error=user_data_error');
        }
      } catch (error) {
        console.error('Unexpected error during auth callback:', error);
        toast.error('Error inesperado durante la autenticación');
        dispatch(setLoading(false));
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch(setToken(null));
        dispatch(setUser(null));
        router.replace('/auth/login?error=unexpected_error');
      } finally {
        setIsProcessing(false);
      }
    };

    processAuth();
  }, [searchParams, router, dispatch]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#14b8a6] mx-auto mb-4"></div>
        <p className="text-gray-600">Autenticando con Google...</p>
        <p className="text-gray-500 text-sm mt-2">Redirigiendo al dashboard...</p>
      </div>
    </div>
  );
}


export type Platform = 'Zoom' | 'Teams' | 'Discord' | 'Google Meet' | 'Otro';

export interface CreadorClase {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  accountType: 'Admin' | 'Instructor' | 'Student';
}

export interface ClaseProgramada {
  id: string;
  title: string;
  description: string;
  platform: Platform;
  meetingLink: string;
  scheduledDate: string;
  duration: number;
  isActive: boolean;
  enrollmentCount: number;
  isEnrolled?: boolean;
  createdBy: CreadorClase;
  createdAt: string;
  updatedAt: string;
}

export interface CrearClaseDto {
  title: string;
  description: string;
  platform: Platform;
  meetingLink: string;
  scheduledDate: string;
  duration: number;
  isActive?: boolean;
}

export interface ActualizarClaseDto {
  title?: string;
  description?: string;
  platform?: Platform;
  meetingLink?: string;
  scheduledDate?: string;
  duration?: number;
  isActive?: boolean;
}

export interface ParametrosConsultaClases {
  platform?: Platform;
  isActive?: boolean;
  enrolled?: boolean;
  search?: string;
  createdBy?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface UsuarioInscrito {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image?: string;
}

export interface DatosCalendario {
  [fecha: string]: ClaseProgramada[];
}

export interface RespuestaListaClases {
  success: boolean;
  data: {
    classes: ClaseProgramada[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    pagination?: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    statistics?: {
      total: number;
      active: number;
      inactive: number;
    };
  };
}

export interface RespuestaCalendario {
  success: boolean;
  data: DatosCalendario;
}

export interface RespuestaClase {
  success: boolean;
  message: string;
  data: ClaseProgramada;
}

export interface RespuestaInscripcion {
  success: boolean;
  message: string;
  data?: {
    enrollment?: {
      id: string;
      userId: string;
      scheduledClassId: string;
      enrolledAt: string;
    };
  };
}

export interface RespuestaVerificarInscripcion {
  success: boolean;
  data: {
    isEnrolled: boolean;
  };
}

export interface RespuestaUsuariosInscritos {
  success: boolean;
  data: {
    enrolledUsers: UsuarioInscrito[];
    total: number;
  };
}

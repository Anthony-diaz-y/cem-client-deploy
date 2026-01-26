import { apiConnector } from "../apiConnector";
import { scheduledClassesEndpoints } from "../apis";
import {
  CrearClaseDto,
  ActualizarClaseDto,
  ParametrosConsultaClases,
  RespuestaListaClases,
  RespuestaCalendario,
  RespuestaClase,
  RespuestaInscripcion,
  RespuestaVerificarInscripcion,
  RespuestaUsuariosInscritos,
} from "@/types/scheduledClasses.types";

const {
  CREATE_CLASS_API,
  GET_CLASSES_API,
  GET_ADMIN_LIST_API,
  GET_CALENDAR_API,
  GET_CLASS_DETAILS_API,
  UPDATE_CLASS_API,
  DELETE_CLASS_API,
  ENROLL_API,
  UNENROLL_API,
  CHECK_ENROLLMENT_API,
  GET_ENROLLMENTS_API,
} = scheduledClassesEndpoints;

export const crearClaseProgramada = async (
  datos: CrearClaseDto,
  token: string
): Promise<RespuestaClase> => {
  const payload = {
    ...datos,
    ...(datos.isActive !== undefined && { isActive: datos.isActive }),
  };
  const respuesta = await apiConnector<RespuestaClase>("POST", CREATE_CLASS_API, payload, {
    Authorization: `Bearer ${token}`,
  });
  return respuesta.data;
};

// Obtener lista de clases con filtros
export const obtenerClases = async (
  parametros: ParametrosConsultaClases,
  token: string
): Promise<RespuestaListaClases> => {
  const queryParams = new URLSearchParams();

  if (parametros.platform) queryParams.append('platform', parametros.platform);
  if (parametros.isActive === true) {
    queryParams.append('isActive', 'true');
  } else if (parametros.isActive === false) {
    queryParams.append('isActive', 'false');
  }
  if (parametros.enrolled !== undefined) queryParams.append('enrolled', String(parametros.enrolled));
  if (parametros.search) queryParams.append('search', parametros.search);
  if (parametros.createdBy) queryParams.append('createdBy', parametros.createdBy);
  if (parametros.startDate) queryParams.append('startDate', parametros.startDate);
  if (parametros.endDate) queryParams.append('endDate', parametros.endDate);
  if (parametros.page) queryParams.append('page', String(parametros.page));
  if (parametros.limit) queryParams.append('limit', String(parametros.limit));

  const url = `${GET_CLASSES_API}?${queryParams.toString()}`;

  const respuesta = await apiConnector<RespuestaListaClases>("GET", url, undefined, {
    Authorization: `Bearer ${token}`,
  });
  return respuesta.data;
};

// Obtener vista de calendario
export const obtenerCalendario = async (
  mes?: string,
  token?: string
): Promise<RespuestaCalendario> => {
  const url = mes ? `${GET_CALENDAR_API}?month=${mes}` : GET_CALENDAR_API;

  const respuesta = await apiConnector<RespuestaCalendario>("GET", url, undefined, token ? {
    Authorization: `Bearer ${token}`,
  } : undefined);
  return respuesta.data;
};

// Obtener detalles de una clase
export const obtenerDetallesClase = async (
  id: string,
  token: string
): Promise<RespuestaClase> => {
  const respuesta = await apiConnector<RespuestaClase>("GET", `${GET_CLASS_DETAILS_API}/${id}`, undefined, {
    Authorization: `Bearer ${token}`,
  });
  return respuesta.data;
};

// Actualizar clase programada
export const actualizarClaseProgramada = async (
  id: string,
  datos: ActualizarClaseDto,
  token: string
): Promise<RespuestaClase> => {
  const respuesta = await apiConnector<RespuestaClase>("PUT", `${UPDATE_CLASS_API}/${id}`, datos as Record<string, unknown>, {
    Authorization: `Bearer ${token}`,
  });
  return respuesta.data;
};

// Eliminar clase programada
export const eliminarClaseProgramada = async (
  id: string,
  token: string
): Promise<{ success: boolean; message: string }> => {
  const respuesta = await apiConnector<{ success: boolean; message: string }>("DELETE", `${DELETE_CLASS_API}/${id}`, undefined, {
    Authorization: `Bearer ${token}`,
  });
  return respuesta.data;
};

// Inscribirse en una clase
export const inscribirseEnClase = async (
  id: string,
  token: string
): Promise<RespuestaInscripcion> => {
  const respuesta = await apiConnector<RespuestaInscripcion>("POST", `${ENROLL_API}/${id}/enroll`, undefined, {
    Authorization: `Bearer ${token}`,
  });
  return respuesta.data;
};

// Desinscribirse de una clase
export const desinscribirseDeClase = async (
  id: string,
  token: string
): Promise<{ success: boolean; message: string }> => {
  const respuesta = await apiConnector<{ success: boolean; message: string }>("DELETE", `${UNENROLL_API}/${id}/enroll`, undefined, {
    Authorization: `Bearer ${token}`,
  });
  return respuesta.data;
};

// Verificar si el usuario está inscrito
export const verificarInscripcion = async (
  id: string,
  token: string
): Promise<RespuestaVerificarInscripcion> => {
  const respuesta = await apiConnector<RespuestaVerificarInscripcion>("GET", `${CHECK_ENROLLMENT_API}/${id}/is-enrolled`, undefined, {
    Authorization: `Bearer ${token}`,
  });
  return respuesta.data;
};

// Obtener usuarios inscritos (Admin/Instructor)
export const obtenerUsuariosInscritos = async (
  id: string,
  token: string
): Promise<RespuestaUsuariosInscritos> => {
  const respuesta = await apiConnector<RespuestaUsuariosInscritos>("GET", `${GET_ENROLLMENTS_API}/${id}/enrollments`, undefined, {
    Authorization: `Bearer ${token}`,
  });
  return respuesta.data;
};

// Obtener lista de clases para administradores con estadísticas y filtros avanzados
export const obtenerClasesAdmin = async (
  parametros: ParametrosConsultaClases,
  token: string
): Promise<RespuestaListaClases> => {
  const queryParams = new URLSearchParams();

  if (parametros.search) queryParams.append('search', parametros.search);
  if (parametros.createdBy) queryParams.append('createdBy', parametros.createdBy);
  if (parametros.platform) queryParams.append('platform', parametros.platform);
  if (parametros.isActive === true) {
    queryParams.append('isActive', 'true');
  } else if (parametros.isActive === false) {
    queryParams.append('isActive', 'false');
  }
  if (parametros.startDate) queryParams.append('startDate', parametros.startDate);
  if (parametros.endDate) queryParams.append('endDate', parametros.endDate);
  if (parametros.page) queryParams.append('page', String(parametros.page));
  if (parametros.limit) queryParams.append('limit', String(parametros.limit));

  const url = `${GET_ADMIN_LIST_API}?${queryParams.toString()}`;

  const respuesta = await apiConnector<RespuestaListaClases>("GET", url, undefined, {
    Authorization: `Bearer ${token}`,
  });
  
  return respuesta.data;
};


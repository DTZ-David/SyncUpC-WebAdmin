// src/services/config/apiConfig.ts
export const API_CONFIG = {
  BASE_URL:
    "https://syncupcwebapi-hufwfwhta2c7a9b7.westus2-01.azurewebsites.net/api",
  TIMEOUT: 10000, // 10 seconds
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

export const ENDPOINTS = {
  FACULTY: {
    GET_ALL: "/faculty/getallfaculties",
  },
  USER: {
    LOGIN_APP: "/user/loginapp",
    REGISTER_STAFF: "/user/registerstaffmember",
  },
  EVENT: {
    GET_ALL: "/event/getallevents",
    GET_COMPLETED: "/event/getalleventsmadeforu",
    CREATE: "/event/create",
    UPDATE: "/event/update",
    DELETE: "/event/delete",
    // Endpoints de metadata están en eventutils
    GET_CATEGORIES: "/eventutils/getalleventcategories",
    GET_TYPES: "/eventutils/getalleventtypes",
    GET_CAMPUS: "/eventutils/getallcampus",
    GET_SPACES: "/eventutils/getallspaces",
  },
  CAREER: {
    GET_ALL: "/career/getallcareers",
  },
  ATTENDANCE: {
    GET_LIST: "/attendance/attendancelist",
  },
  // Nuevos endpoints de métricas
  METRICS: {
    GET_ACADEMIC: "/metrics/getacademicmetrics",
    GET_USER: "/metrics/getusermetrics",
    GET_EVENT: "/metrics/geteventmetrics",
  },
  // NUEVO: Endpoints para imágenes de eventos
  EVENT_IMAGES: {
    GET_MY_IMAGES: "/eventimages/getmyeventimages",
    ADD_IMAGES: "/eventimages/addeventimages",
    DELETE_IMAGES: "/eventimages/deleteeventimages",
  },
};

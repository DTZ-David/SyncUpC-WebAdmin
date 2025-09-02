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
    // Nuevos endpoints para la creación de eventos
    GET_CATEGORIES: "/event/getalleventcategories",
    GET_TYPES: "/event/getalleventtypes",
    GET_CAMPUS: "/event/getallcampus",
    GET_SPACES: "/event/getallspaces",
  },
  CAREER: {
    GET_ALL: "/career/getallcareers",
  },
  ATTENDANCE: {
    GET_LIST: "/attendance/attendancelist",
  },
};

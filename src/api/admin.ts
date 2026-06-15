import api from "../lib/client";

export const adminApi = {
  get: (url: string) =>
    api.get(`/admin${url}`),

  post: (url: string, body?: any) =>
    api.post(`/admin${url}`, body),

  put: (url: string, body?: any) =>
    api.put(`/admin${url}`, body),

  delete: (url: string) =>
    api.delete(`/admin${url}`),
};

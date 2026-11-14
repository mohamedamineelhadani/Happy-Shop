import { client } from "./client";

export const uploadService = {
  /**
   * POST /api/admin/uploads (admin, multipart/form-data)
   * Uploads an image and returns { url, filename, size, mime }.
   */
  image: (file, field = "image") => {
    const form = new FormData();
    form.append(field, file);
    return client.post("/admin/uploads", form);
  },
};

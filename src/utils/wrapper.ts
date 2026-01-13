export interface ApiResponse<T = any> {
  success: boolean;
  code: number;
  data: T | null;
  message: string;
}

export const createResponse = <T = any>(
  success: boolean,
  code: number,
  data: T | null = null,
  message: string = ''
): ApiResponse<T> => {
  return {
    success,
    code,
    data,
    message,
  };
};

export const successResponse = <T = any>(
  data: T,
  message: string = 'Success',
  code: number = 200
): ApiResponse<T> => {
  return createResponse(true, code, data, message);
};

export const errorResponse = (
  message: string,
  code: number = 400,
  data: any = null
): ApiResponse => {
  return createResponse(false, code, data, message);
};
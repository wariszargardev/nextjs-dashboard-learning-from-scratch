// Validation error shape
export interface ValidationError {
    field: string;
    message: string;
  }
  
  // Validate and return errors array — like Laravel's $request->validate()
  export function validateCreateUser(body: any): ValidationError[] {
    const errors: ValidationError[] = [];
  
    // name
    if (!body.name || typeof body.name !== "string") {
      errors.push({ field: "name", message: "name is required" });
    } else if (body.name.trim().length < 2) {
      errors.push({ field: "name", message: "name must be at least 2 characters" });
    } else if (body.name.trim().length > 100) {
      errors.push({ field: "name", message: "name must not exceed 100 characters" });
    }
  
    // email
    if (!body.email || typeof body.email !== "string") {
      errors.push({ field: "email", message: "email is required" });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      errors.push({ field: "email", message: "email must be a valid email address" });
    }
  
    // role (optional but must be valid if provided)
    if (body.role && !["USER", "ADMIN"].includes(body.role)) {
      errors.push({ field: "role", message: "role must be USER or ADMIN" });
    }
  
    return errors;
  }
  
  export function validateUpdateUser(body: any): ValidationError[] {
    const errors: ValidationError[] = [];
  
    // all fields optional on update — only validate if provided
    if (body.name !== undefined) {
      if (typeof body.name !== "string" || body.name.trim().length < 2) {
        errors.push({ field: "name", message: "name must be at least 2 characters" });
      }
      if (body.name.trim().length > 100) {
        errors.push({ field: "name", message: "name must not exceed 100 characters" });
      }
    }
  
    if (body.email !== undefined) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
        errors.push({ field: "email", message: "email must be a valid email address" });
      }
    }
  
    if (body.role !== undefined && !["USER", "ADMIN"].includes(body.role)) {
      errors.push({ field: "role", message: "role must be USER or ADMIN" });
    }
  
    return errors;
  }
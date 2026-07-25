// lib/validators/sendValidationError.ts

import { NextResponse } from "next/server";
import { ValidationError } from "./userValidator";

export function validationErrorResponse(errors: ValidationError[]) {
  return NextResponse.json(
    {
      message: "Validation failed",
      errors:  errors,
    },
    { status: 422 }
  );
}
import { Request, Response, NextFunction, request } from "express"
import { RequestValidationError } from "../errors/request-validation-error"
import { DatabaseConnectionError } from "../errors/database-connection-error"

// return to a spesific message on file.ts
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof RequestValidationError) {
        // it come from ValidationError[] of request-validation-error
        const formattedErrors = err.errors.map(error => { // errors come up from public errors -> RequestValidationError
            return {
                message: error.msg,
                field: error.param
            }
        })

        return res.status(400).send({ errors: formattedErrors })
    }

    if (err instanceof DatabaseConnectionError) {
        return res.status(500).send({
            errors: [
                { message: err.reason }
            ]
        })
    }

    res.status(400).send({ errors: [{ message: 'Something went wrong' }] })
}


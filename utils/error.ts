import { Err } from "utils/result"

export type ServiceError = Err<"SERVICE_ERROR">

export type NotFoundError = Err<"NOT_FOUND">

export type DatabaseError = Err<"DATABASE_ERROR">

export function getErrorMessage(error: unknown) {
	if (typeof error === 'string') return error
	if (
		error &&
		typeof error === 'object' &&
		'message' in error &&
		typeof error.message === 'string'
	) {
		return error.message
	}
	console.error('Unable to get error message for error', error)
	return 'Unknown Error'
}
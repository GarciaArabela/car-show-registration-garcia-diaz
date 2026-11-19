import * as sample from './sample-data'
import * as api from './registrationsApi'

const useSampleData = import.meta.env.VITE_REGISTRATION_DATA_SOURCE === 'sample'
const selectedSource = useSampleData ? sample : api

export const dataSourceLabel = useSampleData ? 'Sample data' : 'C# API'
export const getRegistrations = selectedSource.getRegistrations
export const getSummary = selectedSource.getSummary
export const getAllRegistrations = selectedSource.getAllRegistrations
export const createRegistration = selectedSource.createRegistration

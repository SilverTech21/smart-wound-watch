import { WoundEntry, Patient } from '@/types/wound';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'wound_care_data';

interface StorageData {
  patients: Patient[];
  currentPatientId: string | null;
}

function getStorageData(): StorageData {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    return JSON.parse(data);
  }
  return { patients: [], currentPatientId: null };
}

function saveStorageData(data: StorageData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getCurrentPatientId(): string {
  const data = getStorageData();
  if (!data.currentPatientId) {
    const newPatient = createPatient('Patient');
    return newPatient.id;
  }
  return data.currentPatientId;
}

export function setCurrentPatientId(patientId: string): void {
  const data = getStorageData();
  data.currentPatientId = patientId;
  saveStorageData(data);
}

export function createPatient(name: string): Patient {
  const data = getStorageData();
  const patient: Patient = {
    id: uuidv4(),
    name: `${name} ${data.patients.length + 1}`,
    createdAt: new Date().toISOString(),
    entries: [],
  };
  data.patients.push(patient);
  data.currentPatientId = patient.id;
  saveStorageData(data);
  return patient;
}

export function getAllPatients(): Patient[] {
  const data = getStorageData();
  return data.patients;
}

export function getPatient(patientId: string): Patient | undefined {
  const data = getStorageData();
  return data.patients.find(p => p.id === patientId);
}

export function getPatientEntries(patientId: string): WoundEntry[] {
  const patient = getPatient(patientId);
  return patient?.entries || [];
}

export function getLatestEntry(patientId: string): WoundEntry | undefined {
  const entries = getPatientEntries(patientId);
  return entries.length > 0 ? entries[entries.length - 1] : undefined;
}

export function addWoundEntry(entry: WoundEntry): void {
  const data = getStorageData();
  const patientIndex = data.patients.findIndex(p => p.id === entry.patientId);
  
  if (patientIndex === -1) {
    // Create new patient if doesn't exist
    const newPatient: Patient = {
      id: entry.patientId,
      name: `Patient ${data.patients.length + 1}`,
      createdAt: new Date().toISOString(),
      entries: [entry],
    };
    data.patients.push(newPatient);
  } else {
    data.patients[patientIndex].entries.push(entry);
  }
  
  saveStorageData(data);
}

export function getEntryById(entryId: string): WoundEntry | undefined {
  const data = getStorageData();
  for (const patient of data.patients) {
    const entry = patient.entries.find(e => e.id === entryId);
    if (entry) return entry;
  }
  return undefined;
}

export function getAllEntries(): WoundEntry[] {
  const data = getStorageData();
  return data.patients.flatMap(p => p.entries);
}

export function getUrgentAndConcerningEntries(): WoundEntry[] {
  const allEntries = getAllEntries();
  return allEntries.filter(e => e.status === 'Urgent' || e.status === 'Concerning');
}

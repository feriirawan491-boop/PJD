export interface Employee {
  name: string;
  department: string;
  whatsapp: string;
}

/** Demo records; contact details remain empty until real employee data is supplied. */
export const initialEmployees: Employee[] = [
  'Feri',
  'Putera',
  'Ilham',
  'Emsa',
  'Syaidan',
  'Berrin',
  'Habib',
  'Fauzi',
  'Yoris',
  'Nizar',
].map((name) => ({ name, department: 'Belum ditentukan', whatsapp: '' }));

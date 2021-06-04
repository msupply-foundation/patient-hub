export interface Patient {
  ID: string;
  name: string;
  date_of_birth?: Date;
}

export type SearchParameters = {
  firstName: string;
  lastName: string;
  dateOfBirth: Date | null;
};

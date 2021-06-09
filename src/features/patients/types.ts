export interface Patient {
  ID: string;
  date_of_birth?: Date;
  first?: string;
  last?: string;
  name: string;
}

export type SearchParameters = {
  firstName: string;
  lastName: string;
  dateOfBirth: Date | null;
};

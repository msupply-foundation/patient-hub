export interface Patient {
  ID: string;
  date_of_birth?: Date;
  first?: string;
  last?: string;
  name: string;
}

export interface Vaccinator {
  first_name: string;
  last_name: string;
}
export interface Transaction {
  quantity: number;
  item_name: string;
  ID: string;
  itemLine: ItemLine;
  medicineAdministrator: Vaccinator;
}
export interface ItemLine {
  item: Item;
}
export interface Item {
  code: string;
  doses: number;
  is_vaccine: boolean;
}

export interface PatientHistory {
  confirm_date: string;
  transLines: Transaction[];
}

export type SearchParameters = {
  firstName: string;
  lastName: string;
  dateOfBirth: Date | null;
};

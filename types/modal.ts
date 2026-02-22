import { Employee } from "./employee";

export interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employee: Employee) => void;
}

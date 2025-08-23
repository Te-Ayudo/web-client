import { BiSearch } from "react-icons/bi";
import Input from "../atoms/Input";

export const Search = () => (
  <Input
    name="search"
    type="text"
    label="Buscar Servicio"
    decoration={<BiSearch size="1.5rem" className="text-primary" />}
  />
);

export default Search;

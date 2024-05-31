import { IoSearch } from 'react-icons/io5';

function SearchContactsForm() {
  const handleSubmit = () => {};
  return (
    <div className="top">
      <div className="icons">
        <IoSearch color="#7d8da1" size={22} />
      </div>
      <form className="search-bar chats active" onSubmit={handleSubmit}>
        <input type="text" placeholder="Search contacts" />
      </form>
    </div>
  );
}

export default SearchContactsForm;

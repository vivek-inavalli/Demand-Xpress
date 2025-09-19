import { useState, useEffect } from "react";
import axios from "axios";
import ContactForm from "./components/ContactForm";
import ContactList from "./components/ContactList";
import Pagination from "./components/Pagination";

function App() {
  const [contacts, setContacts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const fetchContacts = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5050/api/contacts?page=${page}&limit=10`
      );
      setContacts(response.data.contacts);
      setPagination(response.data.pagination);
      setCurrentPage(page);
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
      alert("Failed to load contacts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleContactAdded = () => {
    fetchContacts(1); // Go back to first page when new contact is added
  };

  const handleContactDeleted = () => {
    fetchContacts(currentPage);
  };

  const handlePageChange = (page) => {
    fetchContacts(page);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Contact Book
          </h1>
          <p className="text-gray-600">Manage your contacts efficiently</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ContactForm onContactAdded={handleContactAdded} />

          <div className="space-y-6">
            <ContactList
              contacts={contacts}
              onContactDeleted={handleContactDeleted}
              isLoading={isLoading}
            />

            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          </div>
        </div>

        <footer className="text-center text-gray-500 text-sm">
          <p>
            &copy; 2025 Contact Book. Built with React, Express, and MongoDB.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;

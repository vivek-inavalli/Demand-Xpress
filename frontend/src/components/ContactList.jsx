import axios from "axios";

const ContactList = ({ contacts, onContactDeleted, isLoading }) => {
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      await axios.delete(`http://localhost:5050/api/contacts/${id}`);
      onContactDeleted();
      alert("Contact deleted successfully!");
    } catch (error) {
      alert("Failed to delete contact");
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Contacts</h2>
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No contacts found</p>
          <p className="text-gray-400">
            Add your first contact using the form above
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Contacts ({contacts.length})
      </h2>

      <div className="space-y-4">
        {contacts.map((contact) => (
          <div
            key={contact._id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">
                  {contact.name}
                </h3>
                <div className="mt-2 space-y-1">
                  <p className="text-gray-600 flex items-center">
                    <span className="font-medium">Email:</span>
                    <span className="ml-2">{contact.email}</span>
                  </p>
                  <p className="text-gray-600 flex items-center">
                    <span className="font-medium">Phone:</span>
                    <span className="ml-2">{contact.phone}</span>
                  </p>
                </div>
              </div>

              <div className="flex-shrink-0">
                <button
                  onClick={() => handleDelete(contact._id, contact.name)}
                  className="btn-danger"
                  aria-label={`Delete ${contact.name}`}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactList;

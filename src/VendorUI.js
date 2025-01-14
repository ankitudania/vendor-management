import React, { useState, useEffect } from "react";
import { Pencil, Plus, FileEdit, Search, X, Upload } from "lucide-react";

const fetchVendorData = async () => {
  await caches.delete("vendor-data-cache");

  const response = await fetch(
    "https://xifgtugo7e.execute-api.us-east-1.amazonaws.com/No_Auth",
    {
      method: "GET",
      cache: "no-store",
    }
  );
  const result = await response.json();
  return result;
};

// Function to Update existing vendor
const updateVendorData = async (currentData, previousData) => {
  const update_url =
    "https://k3vzhl5ns1.execute-api.us-east-1.amazonaws.com/V1";

  if (currentData.pay_vendor_name !== previousData.pay_vendor_name) {
    const data = {
      currentval: currentData.pay_vendor_name,
      prevval: previousData.pay_vendor_name,
      key: "pay_vendor_name",
      vendorid: currentData.vendor_id,
      naicscode: currentData.naics_code,
    };

    const response = await fetch(update_url, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  if (currentData.naics_priority !== previousData.naics_priority) {
    const data = {
      currentval: currentData.naics_priority,
      prevval: previousData.naics_priority,
      key: "naics_priority",
      vendorid: currentData.vendor_id,
      naicscode: currentData.naics_code,
    };

    const response = await fetch(update_url, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  if (
    currentData.naics_code_description !== previousData.naics_code_description
  ) {
    const data = {
      currentval: currentData.naics_code_description,
      prevval: previousData.naics_code_description,
      key: "naics_code_description",
      vendorid: currentData.vendor_id,
      naicscode: currentData.naics_code,
    };

    const response = await fetch(update_url, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
};

// Function to Add a new vendor
const addVendorData = async (newVendorData) => {
  const add_url = "https://ap5vywmhh5.execute-api.us-east-1.amazonaws.com/V1";

  const response = await fetch(add_url, {
    method: "POST",
    body: JSON.stringify(newVendorData),
  });

  const responseData = await response.json();

  if (responseData.statusCode === 200) {
    return "success";
  }
  if (responseData.statusCode === 202) {
    return "duplicate";
  } else {
    return "error";
  }
};

const fetchVendorDetails = async (vendorId) => {
  try {
    // Replace with your actual API endpoint
    // const response = await fetch(`your-api-endpoint/${vendorId}`);
    // const data = await response.json();
    // return data;
    return "1010101";
  } catch (error) {
    throw new Error("Failed to fetch vendor details");
  }
};

const fetchNaicsDetails = async (naicsCode) => {
  try {
    // Replace with your actual API endpoint
    // const response = await fetch(`your-api-endpoint/${vendorId}`);
    // const data = await response.json();
    // return data;
    return "1010101";
  } catch (error) {
    throw new Error("Failed to fetch vendor details");
  }
};

const saveVendorDetails = async (vendorId, vendorName) => {
  try {

    const action = 'edit'
    const control = 'vendor'
    const apiUrl = "https://ap5vywmhh5.execute-api.us-east-1.amazonaws.com/V1/";

    const requestOptions = {
      method: "POST",
      redirect: "follow",
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      requestOptions,
      mode: "no-cors",
      body: JSON.stringify({ 'vendorid': vendorId, 'vendorname': vendorName, 'action': action, 'control': control }),
    });

    // const data = await response.json();
    // return data;
  } catch (error) {
    throw new Error("Failed to save vendor details");
  }
};

const saveNaicsCodeDetails = async (NaicsCode, naicsDescription) => {
  try {

    const action = 'edit'
    const control = 'naics'
    const apiUrl = "https://ap5vywmhh5.execute-api.us-east-1.amazonaws.com/V1/";

    const requestOptions = {
      method: "POST",
      redirect: "follow",
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      requestOptions,
      mode: "no-cors",
      body: JSON.stringify({ 'naicscode': NaicsCode, 'naicsdescription': naicsDescription, 'action': action, 'control': control }),
    });

    // const data = await response.json();
    // return data;
  } catch (error) {
    throw new Error("Failed to save vendor details");
  }
};


//Notification component
const Notification = ({ type, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 7000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor =
    {
      success: "bg-green-500",
      error: "bg-red-500",
      warning: "bg-yellow-500",
      info: "bg-blue-500",
    }[type] || "bg-gray-500";

  return (
    <div
      className={`fixed top-4 right-4 z-[100] ${bgColor} text-white px-4 py-2 rounded-md shadow-lg transition-all duration-300 ease-in-out`}
    >
      {message}
    </div>
  );
};

const VendorDataGrid = () => {
  const [vendors, setVendors] = useState([]);
  const [filters, setFilters] = useState({
    vendor_id: "",
    pay_vendor_name: "",
    naics_code: "",
    naics_priority: "",
    naics_code_description: "",
  });

  // Add modal state
  const [isAddingVendor, setIsAddingVendor] = useState(false);
  const [newVendor, setNewVendor] = useState({
    vendor_id: "",
    pay_vendor_name: "",
    naics_code: "",
    naics_code_description: "",
    naics_priority: "",
  });
  const [vendorSearched, setVendorSearched] = useState(false);
  const [naicsSearched, setNaicsSearched] = useState(false);

  // Notification state
  const [notification, setNotification] = useState(null);

  // states for the new vendor and NAICS forms
  const [isAddingNewVendor, setIsAddingNewVendor] = useState(false);
  const [isAddingNewNaics, setIsAddingNewNaics] = useState(false);
  const [newVendorForm, setNewVendorForm] = useState({
    vendorId: "",
    vendorName: "",
  });
  const [newNaicsForm, setNewNaicsForm] = useState({
    naicsCode: "",
    naicsDescription: "",
  });

  // state for vendor details and NAICS edit forms
  const [isEditingVendorDetails, setIsEditingVendorDetails] = useState(false);
  const [isEditingNaicsCode, setIsEditingNaicsCode] = useState(false);
  const [vendorDetailsForm, setVendorDetailsForm] = useState({
    vendor_id: "",
    vendor_name: "",
  });
  const [naicsCodeForm, setNaicsCodeForm] = useState({
    naics_code: "",
    naics_description: "",
  });
  const [isVendorIdLocked, setIsVendorIdLocked] = useState(false);
  const [isVendorNameLocked, setIsVendorNameLocked] = useState(true);
  const [isNaicsCodeLocked, setIsNaicsCodeLocked] = useState(false);
  const [isNaicsDescriptionLocked, setIsNaicsDescriptionLocked] = useState(true);

  // state for NAICS priority management
  const [isNaicsPriorityModalOpen, setIsNaicsPriorityModalOpen] =
    useState(false);
  const [selectedVendorData, setSelectedVendorData] = useState(null);
  const [vendorNaicsRecords, setVendorNaicsRecords] = useState([]);
  const [editedNaicsPriorities, setEditedNaicsPriorities] = useState({});

  // Add new state for file upload processing
  const [isProcessing, setIsProcessing] = useState(false);

  // Function to handle opening NAICS priority modal
  const handleNaicsPriorityClick = (vendor) => {
    const vendorRecords = vendors.filter(
      (v) => v.vendor_id === vendor.vendor_id
    );
    setSelectedVendorData(vendor);
    setVendorNaicsRecords(vendorRecords);
    setIsNaicsPriorityModalOpen(true);

    // Initialize edited priorities
    const prioritiesObj = {};
    vendorRecords.forEach((record) => {
      prioritiesObj[record.naics_code] = record.naics_priority;
    });
    setEditedNaicsPriorities(prioritiesObj);
  };

  // Function to validate NAICS priorities
  const validateNaicsPriorities = (priorities) => {
    const values = Object.values(priorities).map(Number);
    const uniqueValues = new Set(values);

    // Check if all priorities are unique and sequential from 1
    return (
      uniqueValues.size === values.length &&
      Math.min(...values) === 1 &&
      Math.max(...values) === values.length
    );
  };

  // Function to handle NAICS priority change
  const handleNaicsPriorityChange = (naicsCode, value) => {
    setEditedNaicsPriorities((prev) => ({
      ...prev,
      [naicsCode]: value,
    }));
  };

  // Function to save updated NAICS priorities
  const handleSaveNaicsPriorities = async () => {
    if (!validateNaicsPriorities(editedNaicsPriorities)) {
      setNotification({
        type: "error",
        message: "Priorities must be unique and sequential starting from 1",
      });
      return;
    }

    try {
      // Update each record with new priority
      for (const record of vendorNaicsRecords) {
        const newPriority = editedNaicsPriorities[record.naics_code];
        if (newPriority !== record.naics_priority) {
          await updateVendorData(
            { ...record, naics_priority: newPriority },
            record
          );
        }
      }

      // Refresh the main vendor list
      const updatedVendorData = await fetchVendorData();
      setVendors(updatedVendorData);

      setNotification({
        type: "success",
        message: "NAICS priorities updated successfully",
      });
      setIsNaicsPriorityModalOpen(false);
    } catch (error) {
      setNotification({
        type: "error",
        message: "Failed to update NAICS priorities",
      });
    }
  };

  // Function to fetch vendor details by ID
  const searchVendorById = async (vendorId) => {
    try {
      // const response = await fetchVendorDetails(vendorId);
      const response = true;
      if (response) {
        setNewVendor((prev) => ({
          ...prev,
          // pay_vendor_name: response.vendor_name, // Assuming the API returns vendor_name
          pay_vendor_name: 'new vendor', // Assuming the API returns vendor_name
        }));
        setVendorSearched(true);
        setNotification({
          type: "success",
          message: "Vendor found",
        });
      }
    } catch (error) {
      setNotification({
        type: "error",
        message: "Vendor not found",
      });
      setNewVendor((prev) => ({
        ...prev,
        pay_vendor_name: "",
      }));
      setVendorSearched(false);
    }
  };

  // Function to fetch NAICS description
  const searchNaicsCode = async (naicsCode) => {
    try {
      // Replace with your actual NAICS lookup API
      // const response = await fetch(`your-naics-api/${naicsCode}`);
      // const data = await response.json();
      const data = true
      if (data) {
        setNewVendor((prev) => ({
          ...prev,
          // naics_code_description: data.description,
          naics_code_description: 'New Naics code',
        }));
        setNaicsSearched(true);
      }
    } catch (error) {
      setNotification({
        type: "error",
        message: "Invalid NAICS code",
      });
      setNewVendor((prev) => ({
        ...prev,
        naics_code_description: "",
      }));
      setNaicsSearched(false);
    }
  };

  // Handler for vendor ID search
  const handleVendorSearch = async () => {
    if (!vendorDetailsForm.vendor_id) {
      setNotification({
        type: "error",
        message: "Please enter a Vendor ID",
      });
      return;
    }

    try {
      const vendorData = await fetchVendorDetails(vendorDetailsForm.vendor_id);
      setVendorDetailsForm((prev) => ({
        ...prev,
        // vendor_name: vendorData.vendor_name
        vendor_name: "Vendor name",
      }));
      setIsVendorIdLocked(true);
      setIsVendorNameLocked(false);
    } catch (error) {
      setNotification({
        type: "error",
        message: "Failed to fetch vendor details",
      });
    }
  };

  // Handler for naics code search
  const handleNaicsSearch = async () => {
    if (!naicsCodeForm.naics_code) {
      setNotification({
        type: "error",
        message: "Please enter a Naics Code",
      });
      return;
    }

    try {
      const naicsData = await fetchNaicsDetails(naicsCodeForm.naics_code);
      setNaicsCodeForm((prev) => ({
        ...prev,
        // naics_description: naicsData.naics_description
        naics_description: "Naics Code Description",
      }));
      setIsNaicsCodeLocked(true);
      setIsNaicsDescriptionLocked(false);
    } catch (error) {
      setNotification({
        type: "error",
        message: "Failed to fetch Naics Code",
      });
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Clear browser storage
        if ("caches" in window) {
          await caches.delete("vendor-data-cache");
        }

        // Clear localStorage
        localStorage.removeItem("vendorData");

        // Clear sessionStorage
        sessionStorage.removeItem("vendorData");
        const vendorData = await fetchVendorData();
        setVendors(vendorData);
      } catch (error) {
        console.error("Failed to fetch vendor data:", error);
      }
    };

    loadData();
  }, []);

  // Handlers for vendor details edit
  const handleVendorDetailsEdit = () => {
    setIsEditingVendorDetails(true);
  };

  // Handler for vendor details save
  const handleVendorDetailsSave = async () => {
    try {
      
      await saveVendorDetails(
        vendorDetailsForm.vendor_id,
        vendorDetailsForm.vendor_name
      );

      setNotification({
        type: "success",
        message: "Vendor details changed successfully",
      });

      // Refresh the dashboard
      const vendorData = await fetchVendorData();
      setVendors(vendorData);

      // Reset form and close modal
      setVendorDetailsForm({ vendor_id: "", vendor_name: "" });
      setIsVendorIdLocked(false);
      setIsVendorNameLocked(false);
      setIsEditingVendorDetails(false);
    } catch (error) {
      setNotification({
        type: "error",
        message: "Failed to update vendor details",
      });
    }
  };

  // Handler for vendor detailsedit modal close
  const handleCloseVendorDetailsModal = () => {
    setVendorDetailsForm({ vendor_id: "", vendor_name: "" });
    setIsVendorIdLocked(false);
    setIsVendorNameLocked(false);
    setIsEditingVendorDetails(false);
  };

  // handlers for NAICS code edit
  const handleNaicsCodeEdit = () => {
    setIsEditingNaicsCode(true);
  };

  const handleNaicsCodeSave = async () => {
    try {
      // Placeholder function for saving NAICS code
      // API call
      await saveNaicsCodeDetails(
        naicsCodeForm.naics_code,
        naicsCodeForm.naics_description
      );

      console.log("NAICS details saved");

      setNotification({
        type: "success",
        message: "NAICS details updated successfully",
      });

      // Refresh the dashboard
      const vendorData = await fetchVendorData();
      setVendors(vendorData);

      setIsEditingNaicsCode(false);
    } catch (error) {
      setNotification({
        type: "error",
        message: "Failed to update NAICS details",
      });
    }
  };

  // Handler for naics code edit modal close
  const handleCloseNaicsCodeModal = () => {
    setNaicsCodeForm({ vendor_id: "", vendor_name: "" });
    setIsNaicsCodeLocked(false);
    setIsEditingNaicsCode(false);
    setIsNaicsDescriptionLocked(true)
  };

  // Handle filter changes
  const handleFilterChange = (column) => (event) => {
    setFilters({
      ...filters,
      [column]: event.target.value.toLowerCase(),
    });
  };

  // Apply filters to data
  const filteredVendors = vendors.filter((vendor) => {
    return Object.keys(filters).every((key) => {
      // If filter is empty, include the vendor
      if (filters[key] === "") return true;

      // For vendor_id, do an exact match
      if (key === "vendor_id") {
        return String(vendor[key]).toLowerCase() === filters[key];
      }

      // For other fields, do a partial match
      return String(vendor[key]).toLowerCase().includes(filters[key]);
    });
  });

  // Open add modal
  const handleAddClick = () => {
    setIsAddingVendor(true);
    setNewVendor({
      vendor_id: "",
      pay_vendor_name: "",
      naics_code: "",
      naics_priority: "",
      naics_code_description: "",
    });
  };

  // Handle add vendor combination input changes with validation
  const handleAddChange = (e) => {
    const { name, value } = e.target;
    if (name === "vendor_id") {
      setVendorSearched(false);
      setNewVendor((prev) => ({
        ...prev,
        [name]: value,
        pay_vendor_name: "",
      }));
    } else if (name === "naics_code") {
      setNaicsSearched(false);
      setNewVendor((prev) => ({
        ...prev,
        [name]: value,
        naics_code_description: "",
      }));
    } else {
      setNewVendor((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Function to process CSV/Excel data
  const processFileData = async (file, isVendor = true) => {
    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
      const text = e.target.result;
      const rows = text.split("\n");

      // Skip header row and process each data row
      for (let i = 1; i < rows.length; i++) {
        const columns = rows[i].split(",");

        if (isVendor) {
          // Process vendor data
          if (columns.length >= 2) {
            const vendorData = {
              vendorId: columns[0].trim(),
              vendorName: columns[1].trim(),
            };

            try {
              // Try to save vendor, ignore if exists
              await handleNewVendorSave(vendorData, true);
            } catch (error) {
              console.log(`Skipping duplicate vendor: ${vendorData.vendorId}`);
              continue;
            }
          }
        } else {
          // Process NAICS data
          if (columns.length >= 2) {
            const naicsData = {
              vendorId: columns[0].trim(),
              naicsCode: columns[1].trim(),
            };

            try {
              await handleNewNaicsSave(naicsData, true);
            } catch (error) {
              console.log(
                `Skipping invalid NAICS entry for vendor: ${naicsData.vendorId}`
              );
              continue;
            }
          }
        }
      }

      setIsProcessing(false);
      setNotification({
        type: "success",
        message: `File processed successfully`,
      });
    };

    reader.onerror = () => {
      setIsProcessing(false);
      setNotification({
        type: "error",
        message: "Error reading file",
      });
    };

    reader.readAsText(file);
  };

  // Save new vendor
  const handleSaveNewVendor = async () => {
    try {
      const result = await addVendorData(newVendor);

      if (result === "success") {
        setIsAddingVendor(false);
        // Add new vendor to the list
        setVendors((prevVendors) => [...prevVendors, newVendor]);

        // Show success notification
        setNotification({
          type: "success",
          message: "Vendor Added Successfully",
        });

        // Close add modal
        setIsAddingVendor(false);
      }

      if (result === "duplicate") {
        setNotification({
          type: "error",
          message: "Vendor Already Exists",
        });
      }
    } catch (error) {
      // Show error notification
      setNotification({
        type: "error",
        message: "Failed To Add vendor",
      });
    }
  };

  // Cancel add
  const handleCancelAdd = () => {
    setIsAddingVendor(false);
  };

  // Function to check if vendor exists
  const checkVendorExists = async (vendorId) => {
    // Placeholder function - replace with actual API call
    return vendors.some((vendor) => vendor.vendor_id === vendorId);
  };

  // Handler for new vendor save
  const handleNewVendorSave = async (vendorData = null, isFromFile = false) => {
    const dataToProcess = vendorData || newVendorForm;

    // Validate inputs if not from file
    if (!isFromFile && (!dataToProcess.vendorId || !dataToProcess.vendorName)) {
      setNotification({
        type: "error",
        message: "Please fill in all fields",
      });
      return;
    }

    try {
      // Only check for existing vendor if not from file
      if (!isFromFile) {
        const action = 'add'
        const control = 'vendor'
        const apiUrl = "https://ap5vywmhh5.execute-api.us-east-1.amazonaws.com/V1/";

        const requestOptions = {
          method: "POST",
          redirect: "follow",
        };

        const response = await fetch(apiUrl, {
          method: "POST",
          requestOptions,
          mode: "no-cors",
          body: JSON.stringify({ 'vendorid': dataToProcess.vendorId, 'vendorname': dataToProcess.vendorName, 'action': action, 'control': control }),
        });
        // const vendorExists = await checkVendorExists(dataToProcess.vendorId);
        // if (vendorExists) {
        //   setNotification({
        //     type: "error",
        //     message: "Vendor ID already exists",
        //   });
        //   return;
        // }
        // else {
        //   // Add new vendor logic
        //   console.log("Saving vendor:", dataToProcess);
        // }
      }


      if (!isFromFile) {
        setNotification({
          type: "success",
          message: "New vendor added successfully",
        });
        setNewVendorForm({ vendorId: "", vendorName: "" });
        setIsAddingNewVendor(false);
      }

      // Refresh vendor data
      const vendorData = await fetchVendorData();
      setVendors(vendorData);
    } catch (error) {
      if (!isFromFile) {
        setNotification({
          type: "error",
          message: "Failed to add new vendor",
        });
      }
      throw error; // Rethrow for file processing to handle
    }
  };

  // Handler for new NAICS save
  const handleNewNaicsSave = async (naicsData = null, isFromFile = false) => {
    const dataToProcess = naicsData || newNaicsForm;

    // Validate inputs if not from file
    if (!isFromFile && (!dataToProcess.naicsCode || !dataToProcess.naicsDescription)) {
      setNotification({
        type: "error",
        message: "Please fill in all fields",
      });
      return;
    }

    try {
      // Only check for existing naics if not from file
      if (!isFromFile) {
        const action = 'add'
        const control = 'naics'
        const apiUrl = "https://ap5vywmhh5.execute-api.us-east-1.amazonaws.com/V1/";

        const requestOptions = {
          method: "POST",
          redirect: "follow",
        };

        const response = await fetch(apiUrl, {
          method: "POST",
          requestOptions,
          mode: "no-cors",
          body: JSON.stringify({ 'naicscode': dataToProcess.naicsCode, 'naicsdescription': dataToProcess.naicsDescription, 'action': action, 'control': control }),
        });
        // const vendorExists = await checkVendorExists(dataToProcess.vendorId);
        // if (vendorExists) {
        //   setNotification({
        //     type: "error",
        //     message: "Vendor ID already exists",
        //   });
        //   return;
        // }
        // else {
        //   // Add new vendor logic
        //   console.log("Saving vendor:", dataToProcess);
        // }
      }

      if (!isFromFile) {
        setNotification({
          type: "success",
          message: "New NAICS code added successfully",
        });
        setNewNaicsForm({ naicsCode: "", naicsDescription: "" });
        setIsAddingNewNaics(false);
      }

      const vendorData = await fetchVendorData();
      setVendors(vendorData);
    }
    catch (error) {
      if (!isFromFile) {
        setNotification({
          type: "error",
          message: "Failed to add new NAICS code",
        });
      }
      throw error;
    }
  };

  // Modified Add Modal JSX
  const renderAddModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96">
        <h2 className="text-xl font-bold mb-4">Add Vendor NAICS Combination</h2>

        <div className="space-y-4">
          {/* Vendor ID with Search */}
          <div className="flex space-x-2">
            <input
              name="vendor_id"
              value={newVendor.vendor_id}
              onChange={handleAddChange}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Vendor ID (required)"
            />
            <button
              onClick={() => searchVendorById(newVendor.vendor_id)}
              className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              disabled={!newVendor.vendor_id}
            >
              <Search size={20} />
            </button>
          </div>

          {/* Vendor Name (read-only) */}
          <input
            name="pay_vendor_name"
            value={newVendor.pay_vendor_name}
            readOnly
            className="w-full px-3 py-2 border rounded-md bg-gray-100"
            placeholder="Vendor Name (auto-filled)"
          />

          {/* NAICS Code with Search */}
          <div className="flex space-x-2">
            <input
              name="naics_code"
              value={newVendor.naics_code}
              onChange={handleAddChange}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="NAICS Code (required)"
              disabled={!vendorSearched}
            />
            <button
              onClick={() => searchNaicsCode(newVendor.naics_code)}
              className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              disabled={!vendorSearched || !newVendor.naics_code}
            >
              <Search size={20} />
            </button>
          </div>

          {/* NAICS Description (read-only) */}
          <input
            name="naics_code_description"
            value={newVendor.naics_code_description}
            readOnly
            className="w-full px-3 py-2 border rounded-md bg-gray-100"
            placeholder="NAICS Description (auto-filled)"
          />

          {/* NAICS Priority (optional) */}
          <input
            name="naics_priority"
            type="number"
            value={newVendor.naics_priority}
            onChange={handleAddChange}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="NAICS Priority (optional)"
            disabled={!naicsSearched}
          />
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={handleCancelAdd}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveNewVendor}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            disabled={!vendorSearched || !naicsSearched}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Render Notification Component */}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      {/* New Vendor Modal */}
      {isAddingNewVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-xl font-bold mb-4">Add New Vendor</h2>
            <div className="space-y-4">
              <input
                type="text"
                value={newVendorForm.vendorId}
                onChange={(e) =>
                  setNewVendorForm((prev) => ({
                    ...prev,
                    vendorId: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Vendor ID"
              />
              <input
                type="text"
                value={newVendorForm.vendorName}
                onChange={(e) =>
                  setNewVendorForm((prev) => ({
                    ...prev,
                    vendorName: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Vendor Name"
              />
              <div className="relative">
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      processFileData(e.target.files[0], true);
                    }
                  }}
                  className="hidden"
                  id="vendor-file-upload"
                />
                <label
                  htmlFor="vendor-file-upload"
                  className="flex items-center justify-center w-full px-4 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 cursor-pointer"
                >
                  <Upload size={20} className="mr-2" />
                  Upload CSV/Excel
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setIsAddingNewVendor(false)}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleNewVendorSave()}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New NAICS Modal */}
      {isAddingNewNaics && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-xl font-bold mb-4">Add New NAICS</h2>
            <div className="space-y-4">
              <input
                type="text"
                value={newNaicsForm.naicsCode}
                onChange={(e) =>
                  setNewNaicsForm((prev) => ({
                    ...prev,
                    naicsCode: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border rounded-md"
                placeholder="NAICS Code"
              />
              <input
                type="text"
                value={newNaicsForm.naicsDescription}
                onChange={(e) =>
                  setNewNaicsForm((prev) => ({
                    ...prev,
                    naicsDescription: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border rounded-md"
                placeholder="NAICS Description"
              />
              <div className="relative">
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      processFileData(e.target.files[0], false);
                    }
                  }}
                  className="hidden"
                  id="naics-file-upload"
                />
                <label
                  htmlFor="naics-file-upload"
                  className="flex items-center justify-center w-full px-4 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 cursor-pointer"
                >
                  <Upload size={20} className="mr-2" />
                  Upload CSV/Excel
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setIsAddingNewNaics(false)}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleNewNaicsSave()}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {isAddingVendor && renderAddModal()}

      {/* Add the NAICS Priority Management Modal  */}
      {isNaicsPriorityModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-3/4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Manage NAICS Priorities - Vendor {selectedVendorData.vendor_id}
              </h2>
              <button
                onClick={() => setIsNaicsPriorityModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">NAICS Code</th>
                    <th className="py-3 px-6 text-left">Description</th>
                    <th className="py-3 px-6 text-left">Priority</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                  {vendorNaicsRecords.map((record) => (
                    <tr
                      key={record.naics_code}
                      className="border-b border-gray-200 hover:bg-gray-100"
                    >
                      <td className="py-3 px-6 text-left">
                        {record.naics_code}
                      </td>
                      <td className="py-3 px-6 text-left">
                        {record.naics_code_description}
                      </td>
                      <td className="py-3 px-6 text-left">
                        <input
                          type="number"
                          min="1"
                          value={editedNaicsPriorities[record.naics_code]}
                          onChange={(e) =>
                            handleNaicsPriorityChange(
                              record.naics_code,
                              e.target.value
                            )
                          }
                          className="w-20 px-2 py-1 border rounded-md"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setIsNaicsPriorityModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNaicsPriorities}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Vendor Details Modal */}
      {isEditingVendorDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-xl font-bold mb-4">Edit Vendor Details</h2>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <input
                  name="vendor_id"
                  value={vendorDetailsForm.vendor_id}
                  onChange={(e) =>
                    setVendorDetailsForm((prev) => ({
                      ...prev,
                      vendor_id: e.target.value,
                    }))
                  }
                  disabled={isVendorIdLocked}
                  className={`w-full px-3 py-2 border rounded-md ${isVendorIdLocked ? "bg-gray-100" : "bg-white"
                    }`}
                  placeholder="Enter Vendor ID"
                />
                {!isVendorIdLocked && (
                  <button
                    onClick={handleVendorSearch}
                    className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    <Search size={20} />
                  </button>
                )}
              </div>
              <input
                name="vendor_name"
                value={vendorDetailsForm.vendor_name}
                onChange={(e) =>
                  setVendorDetailsForm((prev) => ({
                    ...prev,
                    vendor_name: e.target.value,
                  }))
                }
                disabled={isVendorNameLocked}
                className={`w-full px-3 py-2 border rounded-md ${isVendorNameLocked ? "bg-gray-100" : "bg-white"
                  }`}
                placeholder="Vendor Name"
              />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={handleCloseVendorDetailsModal}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleVendorDetailsSave}
                disabled={!isVendorIdLocked || !vendorDetailsForm.vendor_name}
                className={`px-4 py-2 rounded-md ${!isVendorIdLocked || !vendorDetailsForm.vendor_name
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
                  } text-white`}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit NAICS Code Modal */}
      {isEditingNaicsCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-xl font-bold mb-4">Edit NAICS Code</h2>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <input
                  name="naics_code"
                  value={naicsCodeForm.naics_code}
                  onChange={(e) =>
                    setNaicsCodeForm((prev) => ({
                      ...prev,
                      naics_code: e.target.value,
                    }))
                  }
                  disabled={isNaicsCodeLocked}
                  className={`w-full px-3 py-2 border rounded-md ${isNaicsCodeLocked ? "bg-gray-100" : "bg-white"
                    }`}
                  placeholder="Enter NAICS Code"
                />
                {!isNaicsCodeLocked && (
                  <button
                    onClick={handleNaicsSearch}
                    className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    <Search size={20} />
                  </button>
                )}
              </div>
              <input
                name="naics_description"
                value={naicsCodeForm.naics_description}
                disabled={isNaicsDescriptionLocked}
                onChange={(e) =>
                  setNaicsCodeForm((prev) => ({
                    ...prev,
                    naics_description: e.target.value,
                  }))
                }
                className={`w-full px-3 py-2 border rounded-md ${isNaicsDescriptionLocked ? "bg-gray-100" : "bg-white"}`}
                placeholder="NAICS Description"
              />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={handleCloseNaicsCodeModal}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleNaicsCodeSave}
                disabled={!isNaicsCodeLocked || !naicsCodeForm.naics_description}
                className={`px-4 py-2 rounded-md ${!isNaicsCodeLocked || !naicsCodeForm.naics_description
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
                  } text-white`}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 bg-gray-50 border-b flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Vendor Management Grid
          </h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setIsAddingNewVendor(true)}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center"
            >
              <Plus size={20} className="mr-2" /> Add New Vendor
            </button>
            <button
              onClick={() => setIsAddingNewNaics(true)}
              className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 flex items-center"
            >
              <Plus size={20} className="mr-2" /> Add New NAICS
            </button>
            <button
              onClick={handleVendorDetailsEdit}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
            >
              <FileEdit size={20} className="mr-2" /> Edit Vendor Details
            </button>
            <button
              onClick={handleNaicsCodeEdit}
              className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 flex items-center"
            >
              <FileEdit size={20} className="mr-2" /> Edit NAICS Details
            </button>
            <button
              onClick={handleAddClick}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center"
            >
              <Plus size={20} className="mr-2" /> Vendor NAICS Combo
            </button>
          </div>
        </div>

        {/* Filter Inputs */}
        <div className="p-4 grid grid-cols-6 gap-4 bg-gray-50">
          <input
            type="text"
            placeholder="Filter Vendor Id"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.vendor_id}
            onChange={handleFilterChange("vendor_id")}
          />
          <input
            type="text"
            placeholder="Filter Pay Vendor Name"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.pay_vendor_name}
            onChange={handleFilterChange("pay_vendor_name")}
          />
          <input
            type="text"
            placeholder="Filter NAICS Code"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.naics_code}
            onChange={handleFilterChange("naics_code")}
          />
          <input
            type="text"
            placeholder="Filter NAICS Priority"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.naics_priority}
            onChange={handleFilterChange("naics_priority")}
          />
          <input
            type="text"
            placeholder="Filter NAICS Code Description"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.naics_code_description}
            onChange={handleFilterChange("naics_code_description")}
          />
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Vendor Id</th>
                <th className="py-3 px-6 text-left">Pay Vendor Name</th>
                <th className="py-3 px-6 text-left">NAICS Code</th>
                <th className="py-3 px-6 text-left">NAICS Priority</th>
                <th className="py-3 px-6 text-left">NAICS Code Description</th>
                <th className="py-3 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {filteredVendors.length > 0 ? (
                filteredVendors.map((vendor, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="font-medium">{vendor.vendor_id}</span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="font-medium">
                          {vendor.pay_vendor_name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-left">
                      <div className="flex items-center">
                        <span>{vendor.naics_code}</span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-left">
                      <div className="flex items-center">
                        <span>{vendor.naics_priority}</span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-left">
                      <div className="flex items-center">
                        <span>{vendor.naics_code_description}</span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-left">
                      <button
                        onClick={() => handleNaicsPriorityClick(vendor)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Pencil size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No vendors found matching the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-gray-50 text-right">
          <span className="text-gray-600 text-sm">
            Total Records: {filteredVendors.length} / {vendors.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VendorDataGrid;
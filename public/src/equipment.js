document.addEventListener('DOMContentLoaded', () => {
  console.log("Equipment Management Initialized");

  // Populate category and supplier dropdowns
  populateDropdowns();

  // Add Equipment Button
  document.querySelector('#addEquipment').addEventListener('click', () => {
    openModal(); // Open modal for adding new equipment
  });

  // Edit Buttons
  document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const equipmentId = e.target.dataset.id;
      const row = document.querySelector(`tr[data-id="${equipmentId}"]`);
      const data = extractRowData(row);
      openModal(data); // Open modal pre-filled with equipment data
    });
  });

  // Delete Buttons
  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const equipmentId = e.target.dataset.id;
      deleteEquipment(equipmentId);
    });
  });

  // Populate category and supplier dropdowns
  async function populateDropdowns() {
    try {
      // Fetch categories
      const categoriesResponse = await fetch('/api/v1/categories');
      const categories = await categoriesResponse.json();
      const categorySelect = document.getElementById('category_id');
      categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.category_id;
        option.textContent = category.category_name;
        categorySelect.appendChild(option);
      });

      // Fetch suppliers
      const suppliersResponse = await fetch('/api/v1/suppliers');
      const suppliers = await suppliersResponse.json();
      const supplierSelect = document.getElementById('supplier_id');
      suppliers.forEach(supplier => {
        const option = document.createElement('option');
        option.value = supplier.supplier_id;
        option.textContent = supplier.supplier_name;
        supplierSelect.appendChild(option);
      });
    } catch (error) {
      console.error('Error populating dropdowns:', error);
    }
  }

  // Handle Form Submission
  document.querySelector('#equipmentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const equipmentData = Object.fromEntries(formData);
    
    try {
      // If equipment_id exists, it's an update; otherwise, it's a new equipment
      if (equipmentData.equipment_id) {
        await updateEquipment(equipmentData);
      } else {
        await addEquipment(equipmentData);
      }
      
      // Reload the page to reflect changes
      window.location.reload();
    } catch (error) {
      console.error('Error saving equipment:', error);
      alert(error.message || 'Failed to save equipment. Please try again.');
    }
  });

  // Function to add new equipment
  async function addEquipment(data) {
    console.log('Sending equipment data:', {
      name: data.equipment_name,
      image: data.equipment_img || null,
      model_number: data.model_number,
      purchase_date: data.purchase_date,
      quantity: parseInt(data.quantity),
      status: data.status,
      location: data.location,
      category_id: data.category_id || null,
      supplier_id: data.supplier_id || null
    });

    const response = await fetch('/api/v1/equipment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: data.equipment_name,
        image: data.equipment_img || null,
        model_number: data.model_number,
        purchase_date: data.purchase_date,
        quantity: parseInt(data.quantity), // Ensure quantity is a number
        status: data.status,
        location: data.location,
        category_id: data.category_id || null,
        supplier_id: data.supplier_id || null
      })
    });

    if (!response.ok) {
      // Log the full error response
      const errorResponse = await response.json();
      console.error('Error response:', errorResponse);
      throw new Error('Failed to add equipment: ' + (errorResponse.error || 'Unknown error'));
    }

    return await response.json();
  }

  // Function to update existing equipment
  async function updateEquipment(data) {
    const response = await fetch(`/api/v1/equipment/${data.equipment_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: data.equipment_name,
        image: data.equipment_img || null,
        model_number: data.model_number,
        purchase_date: data.purchase_date,
        quantity: parseInt(data.quantity),
        status: data.status,
        location: data.location,
        category_id: data.category_id || null,
        supplier_id: data.supplier_id || null
      })
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error('Error response:', errorResponse);
      throw new Error('Failed to update equipment: ' + (errorResponse.error || 'Unknown error'));
    }
  }

  // Function to delete equipment
  async function deleteEquipment(id) {
    try {
      const response = await fetch(`/api/v1/equipment/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete equipment');
      }

      // Reload the page to reflect changes
      window.location.reload();
    } catch (error) {
      console.error('Error deleting equipment:', error);
      alert('Failed to delete equipment. Please try again.');
    }
  }

  // Helper function to extract row data
  function extractRowData(row) {
    return {
      equipment_id: row.dataset.id,
      equipment_name: row.children[1].textContent.trim(),
      equipment_img: row.children[2].querySelector('img')?.src || "",
      model_number: row.children[3].textContent.trim(),
      purchase_date: row.children[4].textContent.trim(),
      quantity: row.children[5].textContent.trim(),
      status: row.querySelector('.status-cell').textContent.trim(),
      location: row.querySelector('.location-cell').textContent.trim(),
      category_id: row.querySelector('.category-cell').dataset.categoryId,
      supplier_id: row.querySelector('.supplier-cell').dataset.supplierId
    };
  }

  // Helper function to open modal
  function openModal(data = {}) {
    const form = document.querySelector('#equipmentForm');
    form.reset(); // Clear the form
    
    // Populate form if data is provided
    if (data.equipment_id) {
      form.querySelector('#equipment_id').value = data.equipment_id;
      form.querySelector('#equipment_name').value = data.equipment_name;
      form.querySelector('#equipment_img').value = data.equipment_img;
      form.querySelector('#model_number').value = data.model_number;
      form.querySelector('#purchase_date').value = data.purchase_date;
      form.querySelector('#quantity').value = data.quantity;
      form.querySelector('#status').value = data.status;
      form.querySelector('#location').value = data.location;
      form.querySelector('#category_id').value = data.category_id;
      form.querySelector('#supplier_id').value = data.supplier_id;
    }
    
    $('#equipmentModal').modal('show');
  }
});
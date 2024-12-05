$(document).ready(function () {
    // Function to load equipment data and populate the table
    const loadEquipment = function () {
      $.ajax({
        type: "GET",
        url: "/api/v1/equipments/view", // API endpoint for fetching equipment data
        success: function (equipmentData) {
          const tbody = $("#tbody"); // Select the tbody element
          tbody.empty(); // Clear existing rows
  
          // Loop through the equipment data and create table rows
          equipmentData.forEach(function (equipment) {
            const row = `
              <tr>
                <td class="text-center">${equipment.equipment_id}</td>
                <td class="text-center">${equipment.equipment_name}</td>
                <td class="text-center">${equipment.rating}</td>
                <td class="text-center">${equipment.model_number}</td>
                <td class="text-center">${equipment.quantity}</td>
                <td class="text-center">${equipment.status}</td>
                <td class="text-center">${equipment.location}</td>
                <td class="text-center">
                  <button id="${equipment.equipment_id}" class="btn btn-danger remove" type="button">Delete</button>
                </td>
              </tr>
            `;
             tbody.append(row); // Append the row to the table body
          });
  
          alert("Equipment data loaded successfully!");
        },
        error: function (errorResponse) {
          console.error("Error loading equipment:", errorResponse);
          alert(`Error: ${errorResponse.responseText}`);
        },
      });
    };
  
    // // Load equipment data when the page is ready
    loadEquipment();
  });
  
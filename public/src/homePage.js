$(document).ready(function () {
  // Function to load equipment data and populate the grid
  const loadEquipment = function () {
    $.ajax({
      type: "GET",
      url: "/api/v1/equipments/view", // API endpoint for fetching equipment data
      success: function (equipmentData) {
        const equipmentDisplay = $("#equipmentDisplay"); // Select the grid container
        equipmentDisplay.empty(); // Clear existing content

        // Loop through the equipment data and create card elements
        equipmentData.forEach(function (equipment) {
          const card = `
            <div class="col-md-3" style="margin-bottom: 20px;">
              <div class="card" style="border: 1px solid #ddd; padding: 15px; border-radius: 5px;">
                <img src="${equipment.equipment_img || '/images/default.jpg'}" alt="${equipment.equipment_name}" class="img-responsive" style="height: 200px; width: 100%; object-fit: cover;">
                <h4 class="text-center" style="margin-top: 10px;">${equipment.equipment_name}</h4>
                <p class="text-center">Category: ${equipment.category}</p>
                <p class="text-center">Status: ${equipment.status}</p>
                <p class="text-center">Rating: ${equipment.rating} ★</p>
                <p class="text-center">${equipment.description || 'No description available.'}</p>
                <td class="text-center">
                <a href="/equipments/${equipment.equipment_id}" class="btn btn-info">Details</a>
                </td>
              </div>
            </div>
          `;
          equipmentDisplay.append(card); // Append the card to the grid container
        });

        alert("Equipment data loaded successfully!");
      },
      error: function (errorResponse) {
        console.error("Error loading equipment:", errorResponse);
        alert(`Error: ${errorResponse.responseText}`);
      },
    });
  };

  // Load equipment data when the page is ready
  loadEquipment();

  // Event listener for delete button
  $(document).on("click", ".remove", function () {
    const equipmentId = $(this).attr("id");
    $.ajax({
      type: "DELETE",
      url: `/api/v1/equipments/${equipmentId}`,
      success: function () {
        console.log("Equipment deleted successfully!");
        loadEquipment(); // Reload the equipment display
      },
      error: function (errorResponse) {
        console.error("Error deleting equipment:", errorResponse);
        alert(`Error: ${errorResponse.responseText}`);
      },
    });
  });
});

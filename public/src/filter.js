// $(document).ready(function () {
//     // Fetch and populate category dropdown
//     function loadCategories() {
//       $.ajax({
//         type: 'GET',
//         url: '/api/v1/categories', // API to fetch categories
//         success: function (categories) {
//           const categoryDropdown = $('#filterCategory');
//           categoryDropdown.empty(); // Clear existing options
//           categoryDropdown.append('<option value="">All Categories</option>'); // Default option
  
//           categories.forEach((category) => {
//             categoryDropdown.append(
//               `<option value="${category.category_name}">${category.category_name}</option>`
//             );
//           });
//         },
//         error: function (errorResponse) {
//           console.error('Error loading categories:', errorResponse);
//           alert('An error occurred while loading categories.');
//         },
//       });
//     }
  
//     // Function to fetch and display filtered results
//     function fetchFilteredResults() {
//       const name = $('#searchName').val(); // Get search query
//       const category = $('#filterCategory').val(); // Get selected category
//       const status = $('#filterStatus').val(); // Get selected status
//       const rating =$('#filterRating').val();
  
//       $.ajax({
//         type: 'GET',
//         url: '/api/v1/equipment', // API endpoint for fetching filtered equipment
//         data: { name, category, status, rating }, // Send filter parameters
//         success: function (data) {
//           const tableBody = $('#equipmentTable');
//           tableBody.empty(); // Clear previous results
  
//           if (data.length === 0) {
//             tableBody.append(
//               '<tr><td colspan="4" class="text-center">No results found</td></tr>'
//             );
//           } else {
//             data.forEach((equipment) => {
//               const row = `
//                 <tr>
//                   <td class="text-center">${equipment.equipment_id}</td>
//                   <td class="text-center">${equipment.equipment_name}</td>
//                   <td class="text-center">${equipment.category_name}</td>
//                   <td class="text-center">${equipment.status}</td>
//                   <td class="text-center">${equipment.rating}</td>
//                 </tr>
//               `;
//               tableBody.append(row);
//             });
//           }
//         },
//         error: function (errorResponse) {
//           console.error('Error fetching filtered results:', errorResponse);
//           alert('An error occurred while fetching equipment data.');
//         },
//       });
//     }
  
//     // Event listeners for dynamic filtering
//     $('#searchName').on('input', fetchFilteredResults); // Trigger on name input
//     $('#filterCategory').change(fetchFilteredResults); // Trigger on category selection
//     $('#filterStatus').change(fetchFilteredResults); // Trigger on status selection
//     $('#filterRating').change(fetchFilteredResults); // Trigger on status selection
  
//     // Load initial data
//     loadCategories(); // Populate category dropdown
//     fetchFilteredResults(); // Fetch all equipment
//   });

$(document).ready(function () {
    // Fetch and populate category dropdown
    function loadCategories() {
      $.ajax({
        type: 'GET',
        url: '/api/v1/categories', // API to fetch categories
        success: function (categories) {
          const categoryDropdown = $('#filterCategory');
          categoryDropdown.empty(); // Clear existing options
          categoryDropdown.append('<option value="">All Categories</option>'); // Default option
  
          categories.forEach((category) => {
            categoryDropdown.append(
              `<option value="${category.category_name}">${category.category_name}</option>`
            );
          });
        },
        error: function (errorResponse) {
          console.error('Error loading categories:', errorResponse);
          alert('An error occurred while loading categories.');
        },
      });
    }
  
    // Function to fetch and display filtered results
    function fetchFilteredResults() {
      const name = $('#searchName').val(); // Get search query
      const category = $('#filterCategory').val(); // Get selected category
      const status = $('#filterStatus').val(); // Get selected status
      const rating = $('#filterRating').val(); // Get selected rating
  
      // Check if at least one filter is applied
      if (!name && !category && !status && !rating) {
        // If no filters are applied, clear the table and show a message
        const tableBody = $('#equipmentTable');
        tableBody.empty();
        tableBody.append(
          '<tr><td colspan="5" class="text-center">Please apply a filter or enter a name to search.</td></tr>'
        );
        return;
      }
  
      $.ajax({
        type: 'GET',
        url: '/api/v1/equipment', // API endpoint for fetching filtered equipment
        data: { name, category, status, rating }, // Send filter parameters
        success: function (data) {
          const tableBody = $('#equipmentTable');
          tableBody.empty(); // Clear previous results
  
          if (data.length === 0) {
            tableBody.append(
              '<tr><td colspan="5" class="text-center">No results found</td></tr>'
            );
          } else {
            data.forEach((equipment) => {
              const row = `
                <tr>
                  <td class="text-center">${equipment.equipment_id}</td>
                  <td class="text-center">${equipment.equipment_name}</td>
                  <td class="text-center">${equipment.category_name}</td>
                  <td class="text-center">${equipment.status}</td>
                  <td class="text-center">${equipment.rating}</td>
                </tr>
              `;
              tableBody.append(row);
            });
          }
        },
        error: function (errorResponse) {
          console.error('Error fetching filtered results:', errorResponse);
          alert('An error occurred while fetching equipment data.');
        },
      });
    }
  
    // Event listeners for dynamic filtering
    $('#searchName').on('input', fetchFilteredResults); // Trigger on name input
    $('#filterCategory').change(fetchFilteredResults); // Trigger on category selection
    $('#filterStatus').change(fetchFilteredResults); // Trigger on status selection
    $('#filterRating').change(fetchFilteredResults); // Trigger on rating selection
  
    // Load initial data
    loadCategories(); // Populate category dropdown
  });
  
  
  
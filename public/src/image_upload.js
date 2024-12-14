$(document).ready(function () {
    $('#submitBtn').click(function (e) {
        e.preventDefault(); // Prevent the default form submission

        // Create a FormData object
        const formData = new FormData($('#uploadForm')[0]);

        // Perform the AJAX request
        $.ajax({
            url: '/uploadEquipmentImage', // Server endpoint
            type: 'POST',
            data: formData,
            processData: false, // Prevent jQuery from processing the data
            contentType: false, // Prevent jQuery from setting the content type
            success: function (response) {
                alert('Image uploaded successfully!');
                console.log(response);
            },
            error: function (xhr, status, error) {
                alert('Failed to upload image.');
                console.error(xhr.responseText);
            }
        });
    });
});
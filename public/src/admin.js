/*$(document).ready(function(){
    //var id;
    $('#getInfo').click(function(){
      const id = $('#uid').val();
      if(!id){
        alert("Enter an User Id")
        return;
      }
      console.log(id)
      $.ajax({
      type: "GET",
      url: `/api/v1/users/:${id}`,
      success: function(data){
            if(data.length == 0){
        
              $('#name').val('');
              $('#email').val('');
              $('#password').val('');        
              $('#role').val('');
              alert('This user id doesnot exists');
              return;
            }
            const {id,name,email,password,role} = data[0];
            $('#name').val(name);
            $('#email').val(email);
            $('#password').val(password);        
            $('#role').val(role);
        }
      
    }); 
    });

    $("#submit").click(function() {
      const id = $('#uid').val();
      console.log("here",id)
      const name = $('#name').val();
      const email = $('#email').val();
      const password = $('#password').val();        
      const role = $('#role').val();
      if(!name  || !email || !password || !role ){
        alert("missing info");
        return;
      }
      
      const userObj = {
        name,
        email,
        password,
        role

      };

      $.ajax({
        type: "PUT",
        url: `/api/v1/users/:${id}`,
        data: userObj,
        success: function(data){
          if(data) {
            console.log(data);
            alert("succesfully updated")
          }
        },
        error : function(data){
            console.log(data.responseText);
            alert(data.responseText);
        }
      });
  }); 


});  */    

$(document).ready(function () {
    // Fetch user data when "View" button is clicked
    $('#getInfo').click(function () {
      const userId = $('#uid').val(); // Get the user ID from the input field
  
      if (!userId) {
        alert('Please enter a User ID');
        return;
      }
  
      $.ajax({
        type: 'GET',
        url: `/api/v1/users/${userId}`, // Fetch data from the API
        success: function (data) {
          if (!data || data.length === 0) {
            alert('User not found!');
            $('#name').val('');
            $('#Email').val('');
            $('#Password').val('');
            $('#role').val('');
          } else {
            // Extract user details
            const { username, email, password, role } = data[0];
  
            // Populate the form fields with user data
            $('#name').val(username);
            $('#Email').val(email);
            $('#Password').val(password);
            $('#role').val(role);
          }
        },
        error: function (errorResponse) {
          console.error('Error fetching user:', errorResponse);
          alert('An error occurred while fetching user data.');
        },
      });
    });
  
    // Update user data when "Submit" button is clicked
    $('#submit').click(function (event) {
      event.preventDefault(); // Prevent default form submission
  
      const userId = $('#uid').val();
      const name = $('#name').val();
      const email = $('#Email').val();
      const password = $('#Password').val();
      const role = $('#role').val();
  
      if (!name || !email || !password || !role) {
        alert('Please fill out all fields before submitting.');
        return;
      }
  
      const userData = { name, email, password, role };
  
      console.log('Submitting data:', userData); // Debugging log
      console.log('User ID:', userId); // Debugging log
  
      $.ajax({
        type: 'PUT',
        url: `/api/v1/users/${userId}`, // URL with user ID
        contentType: 'application/json',
        data: JSON.stringify(userData),
        success: function (response) {
          alert(response.message); // Show success message
          console.log('API Response:', response); // Debugging log
        },
        error: function (errorResponse) {
          console.error('Error updating user:', errorResponse);
          alert('An error occurred while updating the user.');
        },
      });
    });
  });
  
      
    
      
    
  
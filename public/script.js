// let buttons = document.querySelectorAll(".btn");

// buttons.forEach(button => {
//     button.addEventListener("click", function (event) {
//         let userConfirm = confirm("Do you want to delete the chat?");
//         if (!userConfirm) {
//             event.preventDefault(); // stop form submission if user cancels
//         }
//     });
// });

let buttons = document.querySelectorAll(".btn");

buttons.forEach(button => {
    button.addEventListener("click", function (event) {
        event.preventDefault(); // stop immediate form submission

        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to delete this chat?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel"
        }).then((result) => {
            if (result.isConfirmed) {
                // Submit the form only if user confirms
                event.target.closest("form").submit();
            }
        });
    });
});

$(document).ready(function () {
    console.log("cart.js loaded");
    const username = sessionStorage.getItem("username");


    function updateSum(sum){
        $("#subTotalContainer").empty();
        $("#subTotalContainer").append(
            `<label id="subTotalText">Total: </label>
             <label id="amount">$${sum.toFixed(2)}</label>
            
            `
        )
    }
    $.ajax({
        url: `/cart/getCart?username=${username}`,
        type: "GET",
        success: function (response) {
            $("#cartItems").empty();

            if (!response.books || response.books.length === 0) {
                
                $("#cartItems").append(
                    `<div id="emptyCartMessage">Nothing to see here...</div>`
                )
                updateSum(0);
            
                return;
            }
            let sum = 0
            $("#emptyCartMessage").remove();

            response.books.forEach((book) => {

                
                sum+=book.price;

                updateSum(sum);

                const coverImage =
                    book.coverImage && book.coverImage.trim()
                        ? `data:image/jpeg;base64,${book.coverImage}`
                        : "/images/default-cover.jpg";

                $("#cartItems").append(
                    `<li class="book-item" data-book-id="${book.id}">
                        <div class="image-container">
                            <img src="${coverImage}" 
                                alt="Cover of ${book.title}" 
                                class="book-cover">
                        </div>
                        <div class="book-details">
                            <strong>ISBN:</strong> ${book.isbn} <br>
                            <strong>Title:</strong> ${book.title} <br>
                            <strong>Author:</strong> ${book.author} <br>
                            <strong>Quantity: </strong> ${book.quantity}<br>
                            <strong>Price:</strong> ${book.price}
                        </div>
                        <button class="removeFromCartButton" data-book-id="${book.id}">Remove item</button>
                        <button class="checkoutFromCartButton" data-book-id="${book.id}">Checkout</button>
                    </li>`
                );
            });

            // Event delegation for remove button
            $("#cartItems").on("click", ".removeFromCartButton", function () {
                const bookId = $(this).data("book-id");
                const bookItem = $(this).closest(".book-item"); // Cache the book item element

                $.ajax({
                    url: `/cart/removeFromCart?bookID=${bookId}&username=${username}`,
                    type: "DELETE",
                    success: function (response) {
                        alert("Book removed from cart.");
                        // Remove the item from the DOM
                        

                        let price = response;
                        console.log("current price" + price);

                        let currAmount = parseFloat($("#amount").text().replace("$", "").trim());
                        console.log("current amount" + currAmount);

                        let sum = currAmount - price;
                        console.log("current sum" + sum);

                        if (price < 0){
                            sum = 0;
                        }

                        updateSum(sum);

                        bookItem.remove();

                        // Optionally, check if the cart is now empty and show a message
                        if ($("#cartItems").children().length === 0) {
                            $("#cartItems").append(
                    
                                `<div id="emptyCartMessage">Nothing to see here...</div>`
                            )
                            
                        }
                    },
                    error: function (xhr, status, error) {
                        alert("Failed to remove the book from cart.");
                        console.error("Error:", error);
                    }
                });
            });

            // Event delegation for checkout button
            $("#cartItems").on("click", ".checkoutFromCartButton", function () {
                const bookId = $(this).data("book-id");
                const bookItem = $(this).closest(".book-item"); // Cache the book item element

                $.ajax({
                    url: `/cart/checkoutBook?bookID=${bookId}&username=${username}`,
                    type: "POST", // Assuming backend uses POST for checkoutBook method
                    success: function (response) {
                        alert("Book checked out successfully.");

                        // Remove the item from the DOM
                        bookItem.remove();

                        // Optionally, check if the cart is now empty and show a message
                        if ($("#cartItems").children().length === 0) {
                            $("#emptyCartMessage").text("Your cart is now empty.").show();
                        }
                    },
                    error: function (xhr, status, error) {
                        alert("Failed to checkout the book.");
                        console.error("Error:", error);
                    }
                });
            });
        },
        error: function (xhr, status, error) {
            $("#emptyCartMessage").text("Failed to retrieve cart. Please try again.").show();
            console.error("Failed to retrieve cart:", error);
        }
    });


    
});

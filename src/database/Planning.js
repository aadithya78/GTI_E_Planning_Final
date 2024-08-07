/* let selectedProcess;
document.addEventListener('DOMContentLoaded', (event)=>{
  event.preventDefault();
 const ProcShift = document.querySelectorAll('.folder-list-process input[type="radio"]')
 ProcShift.forEach(radiotype =>{
  radiotype.addEventListener('change', ()=>{
    if(radiotype.checked){
      console.log(`The Selected Process is ${radiotype.value}`);
      selectedProcess = radiotype.value;    
    }

  });
 });
});
*/
    const pageTitle = "Guided Terminal Assemble Station";
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}/${
      currentDate.getMonth() + 1
    }/${currentDate.getFullYear().toString().slice(-2)}`;
    const formattedTime = currentDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const imageContainer = document.getElementById("image-container");

    onButton.addEventListener("click", function() {
        imageContainer.style.display = "block"; // Show image when ON button is clicked
    });

    offButton.addEventListener("click", function() {
        imageContainer.style.display = "none"; // Hide image when OFF button is clicked
    });


    const button3Text = "ADMIN";
    const button4Text = "SHIFT";
    document.getElementById("pageTitle").innerHTML = pageTitle;
    document.getElementById("buttons1").innerHTML = formattedDate;
    document.getElementById("buttons2").innerHTML = formattedTime;
    document.getElementById("buttons3").innerHTML = button3Text;
    document.getElementById("buttons4").innerHTML = button4Text;

const button = document.querySelector('.anim-button');
button.addEventListener('click', () => {
  button.classList.toggle('animate');
  setTimeout(() => {
    button.classList.toggle('animate');
  }, 500); // remove animation class after 500ms
});




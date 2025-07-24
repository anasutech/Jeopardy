// You only need to touch comments with the todo of this file to complete the assignment!

/*
=== How to build on top of the starter code? ===

Problems have multiple solutions.
We have created a structure to help you on solving this problem.
On top of the structure, we created a flow shaped via the below functions.
We left descriptions, hints, and to-do sections in between.
If you want to use this code, fill in the to-do sections.
However, if you're going to solve this problem yourself in different ways, you can ignore this starter code.
 */

/*
=== Terminology for the API ===

Clue: The name given to the structure that contains the question and the answer together.
Category: The name given to the structure containing clues on the same topic.
 */

/*
=== Data Structure of Request the API Endpoints ===

/categories:
[
  {
    "id": <category ID>,
    "title": <category name>,
    "clues_count": <number of clues in the category where each clue has a question, an answer, and a value>
  },
  ... more categories
]

/category:
{
  "id": <category ID>,
  "title": <category name>,
  "clues_count": <number of clues in the category>,
  "clues": [
    {
      "id": <clue ID>,
      "answer": <answer to the question>,
      "question": <question>,
      "value": <value of the question (be careful not all questions have values) (Hint: you can assign your own value such as 200 or skip)>,
      ... more properties
    },
    ... more clues
  ]
}
 */

const API_URL = "https://rithm-jeopardy.herokuapp.com/api/"; // The URL of the API.
const NUMBER_OF_CATEGORIES = 6; // The number of categories you will be fetching. You can change this number.
const NUMBER_OF_CLUES_PER_CATEGORY = 5; // The number of clues you will be displaying per category. You can change this number.

let categories = []; // The categories with clues fetched from the API.
/*
[
  {
    "id": <category ID>,
    "title": <category name>,
    "clues": [
      {
        "id": <clue ID>,
        "value": <value (e.g. $200)>,
        "question": <question>,
        "answer": <answer>
      },
      ... more categories
    ]
  },
  ... more categories
]
 */

let activeClue = null; // Currently selected clue data.
let activeClueMode = 0; // Controls the flow of #active-clue element while selecting a clue, displaying the question of selected clue, and displaying the answer to the question.
/*
0: Empty. Waiting to be filled. If a clue is clicked, it shows the question (transits to 1).
1: Showing a question. If the question is clicked, it shows the answer (transits to 2).
2: Showing an answer. If the answer is clicked, it empties (transits back to 0).
 */

let isPlayButtonClickable = true; // Only clickable when the game haven't started yet or ended. Prevents the button to be clicked during the game.

$("#play").on("click", handleClickOfPlay);

/**
 * Manages the behavior of the play button (start or restart) when clicked.
 * Sets up the game.
 *
 * Hints:
 * - Sets up the game when the play button is clickable.
 */
function handleClickOfPlay ()
{
  // todo set the game up if the play button is clickable
  if(isPlayButtonClickable)
    {
      
      setupTheGame();
      
      isPlayButtonClickable=false;

  }
  else{
    let bubble=document.getElementById('messageBubble');
    bubble.style.display='block';
    setTimeout(() => {
    bubble.style.display = 'none';
  }, 3000);
  }
}

/**
 * Sets up the game.
 *
 * 1. Cleans the game since the user can be restarting the game.
 * 2. Get category IDs
 * 3. For each category ID, get the category with clues.
 * 4. Fill the HTML table with the game data.
 *
 * Hints:
 * - The game play is managed via events.
 */
async function setupTheGame ()
{
  // todo show the spinner while setting up the game
  const spinner= document.getElementById('spinner');
  spinner.classList.remove('disabled');

  // todo reset the DOM (table, button text, the end text)
  document.getElementById('categories').innerHTML='';
  document.getElementById('clues').innerHTML='';
  document.getElementById('active-clue').innerHTML='';
  document.getElementById('play').innerText='Loading....';
 

  // todo fetch the game data (categories with clues)
 const categoryIds= await getCategoryIds();
 
 for( const categoryId of categoryIds)
 {
   const categoryData= await getCategoryData(categoryId);
   categories.push(categoryData);  
 }
 


  // todo fill the table
    fillTable(categories);
    document.getElementById('spinner').classList.add('disabled');
    document.getElementById('play').innerText='Restart the game';
}

/**
 * Gets as many category IDs as in the `NUMBER_OF_CATEGORIES` constant.
 * Returns an array of numbers where each number is a category ID.
 *
 * Hints:
 * - Use /categories endpoint of the API.
 * - Request as many categories as possible, such as 100. Randomly pick as many categories as given in the `NUMBER_OF_CATEGORIES` constant, if the number of clues in the category is enough (<= `NUMBER_OF_CLUES` constant).
 */
async function getCategoryIds ()
{
  const ids = []; // todo set after fetching
  try
  {
     // todo fetch NUMBER_OF_CATEGORIES amount of categories
    const response = await axios.get(`${API_URL}categories?count=100`);
    const filteredCategories = response.data.filter(category => category.clues_count >= NUMBER_OF_CLUES_PER_CATEGORY);
    //console.log(filteredCategories);
    const randomCategories=_.sampleSize(filteredCategories, NUMBER_OF_CATEGORIES);
   // console.log(randomCategories);
    for( let category of randomCategories)
    {
      ids.push(category.id);
    }
    //console.log(ids);
    return ids;
  }
  catch(error)
  {
    console.error("Error fetching categories:", error);
  }

  
  
}

/**
 * Gets category with as many clues as given in the `NUMBER_OF_CLUES` constant.
 * Returns the below data structure:
 *  {
 *    "id": <category ID>
 *    "title": <category name>
 *    "clues": [
 *      {
 *        "id": <clue ID>,
 *        "value": <value of the question>,
 *        "question": <question>,
 *        "answer": <answer to the question>
 *      },
 *      ... more clues
 *    ]
 *  }
 *
 * Hints:
 * - You need to call this function for each category ID returned from the `getCategoryIds` function.
 * - Use /category endpoint of the API.
 * - In the API, not all clues have a value. You can assign your own value or skip that clue.
 */
async function getCategoryData (categoryId)
{
  try
  {
     const response = await axios.get(`${API_URL}category?id=${categoryId}`);
     const category = response.data;
     const categoryWithClues = {
           id: categoryId,
           title: category.title, // todo set after fetching
           clues: [] // todo set after fetching
         };

  // todo fetch the category with NUMBER_OF_CLUES_PER_CATEGORY amount of clues
    let validClues = 0;
    for( clue of category.clues)
    {
      
        categoryWithClues.clues.push({
          id: clue.id,
          value: clue.value !=null ? clue.value: (validClues + 1) * 100 ,
          question: clue.question,
          answer: clue.answer

        });
        validClues++;
      
      if(validClues > NUMBER_OF_CLUES_PER_CATEGORY)
      {
        break;
      }
    }

    return categoryWithClues;
  }
  catch(error)
  {
   console.error(`Error fetching category ${categoryId}:`, error);
    return null;
  }
 
}

/**
 * Fills the HTML table using category data.
 *
 * Hints:
 * - You need to call this function using an array of categories where each element comes from the `getCategoryData` function.
 * - Table head (thead) has a row (#categories).
 *   For each category, you should create a cell element (th) and append that to it.
 * - Table body (tbody) has a row (#clues).
 *   For each category, you should create a cell element (td) and append that to it.
 *   Besides, for each clue in a category, you should create a row element (tr) and append it to the corresponding previously created and appended cell element (td).
 * - To this row elements (tr) should add an event listener (handled by the `handleClickOfClue` function) and set their IDs with category and clue IDs. This will enable you to detect which clue is clicked.
 */
function fillTable (categories)
{
  // todo
  const theadRow =document.getElementById("categories");
  const tbodyRow = document.getElementById("clues");
  theadRow.innerHTML='';
  tbodyRow.innerHTML='';
   
  for(const category of categories)
  {
    if(category)
    {
      const th=document.createElement('th');
      th.innerText=category.title;
      th.setAttribute('id', category.id);
      theadRow.appendChild(th);
      const td= document.createElement('td');
      for(clue of category.clues)
      {
        const tr = document.createElement("tr");
        tr.innerText=clue.value;
        tr.id=clue.id +'-'+ category.id;
        tr.classList.add('clue');
       //tr.addEventListener("click",() => handleClickOfClue)
        td.appendChild(tr);
        
        
      }
       tbodyRow.appendChild(td);
    }
    
    $(".clue").on("click", handleClickOfClue);

  }
  
}



/**
 * Manages the behavior when a clue is clicked.
 * Displays the question if there is no active question.
 *
 * Hints:
 * - Control the behavior using the `activeClueMode` variable.
 * - Identify the category and clue IDs using the clicked element's ID.
 * - Remove the clicked clue from categories since each clue should be clickable only once. Don't forget to remove the category if all the clues are removed.
 * - Don't forget to update the `activeClueMode` variable.
 *
 */
function handleClickOfClue (event)
{
  // todo find and remove the clue from the categories

  // todo mark clue as viewed (you can use the class in style.css), display the question at #active-clue
  if (activeClueMode !== 0) return;

  const clueId=event.currentTarget.id;
  const [clueIdNum, catId]=clueId.split('-');

  for(let i=0; i < categories.length; i++)
  {
      const cat=categories[i];
      if( String(cat.id === catId))
      {
        const clueIndex = cat.clues.findIndex(cl => String(cl.id) === clueIdNum);
        const clueActive= document.getElementById('active-clue');
        if(clueIndex !==-1)
        {
          activeClue=cat.clues[clueIndex];
          activeClueMode=1;
          clueActive.style.visibility='visible';
           $("#active-clue").text(activeClue.question);
           
           event.currentTarget.classList.add('viewed');
           cat.clues.splice(clueIndex, 1);
          if(cat.clues.length === 0)
          {
            categories.splice(i, 1);
          }
           console.log(cat);
      console.log(categories);
            break;
        }


      }
     
  }
 

}

$("#active-clue").on("click", handleClickOfActiveClue);

/**
 * Manages the behavior when a displayed question or answer is clicked.
 * Displays the answer if currently displaying a question.
 * Clears if currently displaying an answer.
 *
 * Hints:
 * - Control the behavior using the `activeClueMode` variable.
 * - After clearing, check the categories array to see if it is empty to decide to end the game.
 * - Don't forget to update the `activeClueMode` variable.
 */
function handleClickOfActiveClue (event)
{
  // todo display answer if displaying a question

  // todo clear if displaying an answer
  // todo after clear end the game when no clues are left

  if (activeClueMode === 1)
  {
    activeClueMode = 2;
    $("#active-clue").html(activeClue.answer);
  }
  else if (activeClueMode === 2)
  {
    activeClueMode = 0;
    $("#active-clue").html(null);

    if (categories.length === 0)
    {
      isPlayButtonClickable = true;
      $("#play").text("Restart the Game!");
      $("#active-clue").html("The End!");
       

    }
  }
}
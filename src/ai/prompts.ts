const add = `
Write a pop quiz question for a middle schooler based on the specified topic and question topic. The question should include four answer choices and the correct answer. It can have more than one correct answer.

Topic: The thirteen colonies and their impact on America.
Question topic: The Mayflower.
{
    "question": "Which of the following was brought to America by the Mayflower?",
    "choices": [
      "The Declaration of Independence",
      "The Bill of Rights",
      "The Constitution",
      "Religious freedom"
    ],
    "answers": [3]
  }

###

Topic: $TOPIC.
Question topic: $QTOPIC.
{
`;

const generate = `Write five pop quiz questions for a middle schooler about the specified topic. Provide four answer choices for each question, including the correct answer. Two of the questions should have more than one correct answer. Choose a category for the quiz which can be math, science, English, social studies, history, or other. Write as many tags as possible. The final response should be in JSON format.

Topic: The thirteen colonies and the colonization of America.
{
  "category": "history",
  "tags": "America,colonization,colony",
  "questions": [
    {
      "question": "Which of the following was one of the original thirteen colonies?",
      "choices": [
        "Pennsylvania",
        "Virginia",
        "Texas",
        "Massachusetts"
      ],
      "answers": [0,1,3]
    },
    {
      "question": "Who was the leader of the expedition that founded the Jamestown settlement?",
      "choices": [
        "John Smith",
        "Christopher Columbus",
        "William Bradford",
        "James Oglethorpe"
      ],
      "answers": [0]
    },
    {
      "question": "What was the primary reason the original settlers came to America?",
      "choices": [
        "To find religious freedom",
        "To find wealth",
        "To explore new lands",
        "To trade goods"
      ],
      "answers": [0,1]
    },
    {
      "question": "What were the three regions of the thirteen colonies?",
      "choices": [
        "North, East, West",
        "New England, Mid-Atlantic, South",
        "English, French, Spanish",
        "Industrial, Rural, Coastal"
      ],
      "answers": [1]
    },
    {
      "question": "Which of the following was a key factor in the success of the Jamestown settlement?",
      "choices": [
        "Tobacco",
        "Gold",
        "Religion",
        "Trade"
      ],
      "answers": [0]
    },
    {
      "question": "Who founded the colony of Pennsylvania?",
      "choices": [
        "William Bradford",
        "James Oglethorpe",
        "John Smith",
        "William Penn"
      ],
      "answers": [3]
    },
    {
      "question": "What was the primary purpose of the Mayflower Compact?",
      "choices": [
        "To establish a government",
        "To create laws",
        "To declare independence",
        "To promote religious freedom"
      ],
      "answers": [0]
    },
    {
      "question": "What was the name of the document that served as the basis for self-government in the colonies?",
      "choices": [
        "The Constitution",
        "The Declaration of Independence",
        "The Mayflower Compact",
        "The Articles of Confederation"
      ],
      "answers": [2]
    },
    {
      "question": "Which of the following was a key event leading to the American Revolution?",
      "choices": [
        "The Stamp Act",
        "The Boston Tea Party",
        "The Louisiana",
        "The Emancipation Proclamation"
      ],
      "answers": [1]
    },
    {
      "question": "What was the first battle of the American Revolution?",
      "choices": [
        "Battle of Bunker Hill",
        "Battle of Saratoga",
        "Battle of Yorktown",
        "Battle of Lexington and Concord"
      ],
      "answers": [3]
    }
  ]
}

###

Topic: $TOPIC
{
`;

export {
    generate,
    add
}
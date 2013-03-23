/**
 * Created with IntelliJ IDEA.
 * User: cosimogapminder
 * Date: 2013-03-23
 * Time: 22:21
 */

var contacts = [];
var orderContactsByLastName = true;
var options = "1 = Lägg till kontakt; " +
    "2 = Sök; " +
    "3 = Lista alla kontakter; " +
    "4 = Ändra sorteringsordning; " +
    "5 = Redigera kontakt; " +
    "0 = Avsluta";

var running = true;
while (running)
{
    print("\n* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * ")
    var answer = ask("Vad vill du göra?\n" + options);

    switch (answer)
    {
        case "1":
            addPerson();
            break;
        case "2":
            searchPerson();
            break;
        case "3":
            listAll();
            break;
        case "4":
            changeSortOrder();
            break;
        case "5":
            editPerson();
            break;
        case "0":
            running = false;
            break;
    }
}

print("Adjöss!");

function addPerson()
{
    var firstName = ask("Ange förnamn");
    var lastName = ask("Ange efternamn");

    var person = new Contact(normalizeName(firstName), normalizeName(lastName));

    contacts[getPersonSortableName(person)] = person;
}

function searchPerson()
{
    var searchString = ask("Ange hela eller delar av för/efternamn:");
    var candidates = [];

    var currentContactKeys = Object.keys(contacts);
    for (var i = 0; i < currentContactKeys.length; i++)
    {
        var contactKey = currentContactKeys[i];
        var person = contacts[contactKey];
        if (person.getWholeName().toUpperCase().indexOf(searchString.toUpperCase()) >= 0)
        {
            candidates[contactKey] = person;
        }
    }

    print("\nSökresultat:");
    listAll(candidates);
}

function listAll(personsToList)
{
    if (!personsToList)
    {
        personsToList = contacts;
    }

    var contactNames = Object.keys(personsToList);
    contactNames.sort();

    for (var i = 0; i < contactNames.length; i++)
    {
        var contactName = contactNames[i];
        print((i + 1) + ". " + contactName);
    }
}

function changeSortOrder()
{
    orderContactsByLastName = !orderContactsByLastName;

    var newContacts = [];

    var currentContactKeys = Object.keys(contacts);
    for (var i = 0; i < currentContactKeys.length; i++)
    {
        var contactKey = currentContactKeys[i];
        var person = contacts[contactKey];
        newContacts[getPersonSortableName(person)] = person;
    }

    contacts = newContacts;

    print("");
    if (orderContactsByLastName)
    {
        print("Sorterar på efternamn i stället:");
    }
    else
    {
        print("Sorterar på förnamn i stället:");
    }

    listAll();
}

function editPerson()
{
    print("\nFöljande kontakter finns i adressboken:");

    listAll();

    var contactIndex = ask("\nAnge siffran för den kontakt du vill ändra.");

    var contactNames = Object.keys(contacts);
    contactNames.sort();

    var contact = contacts[contactNames[contactIndex - 1]];

    var newFirstName = ask("Ange nytt förnamn (nuvarande är " + contact.getFirstName() + "):");
    var newLastName = ask("Ange nytt efternamn (nuvarande är " + contact.getLastName() + "):");

    delete contacts[contactNames[contactIndex - 1]];

    contact.setFirstName(newFirstName);
    contact.setLastName(newLastName);
    contacts[getPersonSortableName(contact)] = contact;

    print("\nKontaktinformationen är uppdaterad.");
    listAll();
}

function getPersonSortableName(person)
{
    if (orderContactsByLastName)
    {
        return person.getLastName() + ", " + person.getFirstName();
    }
    else
    {
        return person.getFirstName() + " " + person.getLastName();
    }
}

function Contact(firstName, lastName)
{
    var contactType;
    var contactRole;

    this.setFirstName = function(name)
    {
        firstName = name;
    };

    this.setLastName = function(name)
    {
        lastName = name;
    };

    this.getFirstName = function()
    {
        return firstName;
    };

    this.getLastName = function()
    {
        return lastName;
    };

    this.getWholeName = function()
    {
        return firstName + " " + lastName;
    }
}

function normalizeName(name)
{
    // normalize for general comparability
    name = name.toLowerCase();

    var nameToReturn = "";

    // if several/middle names are provided
    var nameParts = name.split(" ");
    for (var i = 0; i < nameParts.length; i++)
    {
        var namePart = nameParts[i];
        nameToReturn += namePart.charAt(0).toUpperCase() + namePart.slice(1) + " ";
    }

    return nameToReturn.trim();
}

function ask(question)
{
    print(question);
    return readline();
}

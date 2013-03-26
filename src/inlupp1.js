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
    print("\n* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * ");

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
            listAndShow();
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

    var contact = new Contact(normalizeName(firstName), normalizeName(lastName));

    addPhoneNumbers(contact);
    addAddresses(contact);

    contacts[getPersonSortableName(contact)] = contact;
}

function addPhoneNumbers(contact)
{
    var addingNumbers = true;

    while (addingNumbers)
    {
        var phoneNumber = ask("Lägg till nytt telefonnummer (eller tryck Enter för att gå vidare):");
        if (phoneNumber)
        {
            var phoneNumberType = ask("Ange nummertyp (eller tryck Enter för att gå vidare):");
            contact.addPhoneNumber(new PhoneNumber(phoneNumber, phoneNumberType))
        }
        else
        {
            addingNumbers = false;
        }
    }
}

function addAddresses(contact)
{
    var addingAddresses = true;

    while (addingAddresses)
    {
        var addressName = ask("Lägg till ny adress (eller tryck Enter för att gå vidare):");
        if (addressName)
        {
            var street = ask("Ange gatuadress:");
            var zip = ask("Ange postkod:");
            var city = ask("Ange postort:");
            contact.addAddress(new Address(addressName, street, zip, city))
        }
        else
        {
            addingAddresses = false;
        }
    }
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

function listAndShow()
{
    print("");
    print("Kontaktlista:");
    listAll();

    var contactIndex = ask("\nAnge siffran för den kontakt du vill visa, eller tryck Enter för att gå tillbaka till huvudmenyn.");

    if (contactIndex)
    {
        var contactNames = Object.keys(contacts);
        contactNames.sort();

        var contact = contacts[contactNames[contactIndex - 1]];

        contact.printContact();
    }
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
    contact.printContact();
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

// Objects

function Contact(firstName, lastName)
{
    var phoneNumbers = [];
    var addresses = [];

    this.printContact = function()
    {
        var indentation = "    ";

        print("");
        print("KONTAKT");
        print("Förnamn: " + firstName);
        print("Efternamn: " + lastName);

        if (phoneNumbers.length > 0)
        {
            print("Telefonnummer:");
            for (var i = 0; i < phoneNumbers.length; i++)
            {
                var phoneNumber = phoneNumbers[i];
                print(indentation + phoneNumber.getPhoneNumberRecord());
            }
        }

        if (addresses.length > 0)
        {
            print("Adresser:");
            for (var j = 0; j < addresses.length; j++)
            {
                var address = addresses[j];
                print(indentation + address.getAddressRecord());
            }
        }

        print("");
    };

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
    };

    this.addPhoneNumber = function(phoneNumber)
    {
        phoneNumbers.push(phoneNumber);
    };

    this.addAddress = function(address)
    {
        addresses.push(address);
    };
}

function PhoneNumber(number, type)
{
    this.getPhoneNumberRecord = function()
    {
        var numberType = type || "General";
        return number + " (" + numberType + ")";
    };
}

function Address(name, street, zip, city)
{
    this.getAddressRecord = function()
    {
        return name + ", " + street + ", " + zip + " " + city;
    };

    this.setAddressName = function(newName)
    {
        name = newName;
    };

    this.setAddressStreet = function(newStreet)
    {
        street = newStreet;
    };

    this.setAddressZip = function(newZip)
    {
        zip = newZip;
    };

    this.setAddressCity = function(newCity)
    {
        city = newCity;
    };
}


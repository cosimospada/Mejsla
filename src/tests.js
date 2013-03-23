/**
 * Created with IntelliJ IDEA.
 * User: cosimogapminder
 * Date: 2013-03-21
 * Time: 22:01
 */

var a = 1;
a++;
print(a++);

var theBone = new Bone("Batz");

//print(theBone.getName("!!!"));

var number = 12.3;
print(number);
print(isNaN(undefined));

var hey = [];
var chunk = [];
var chonk = [];
chunk.push(2);
chonk.push(2);
chonk.push(2);

hey.push(chunk);
hey.push(chonk);

print(hey.length);
print(hey[0].length);
print(hey[1].length);

function Bone(name)
{
    this.getName = function(interject)
    {
        print("What is your last name?");
//        var lastName = readline();
        return "Hey " + name + " " + lastName + interject;
    }
}

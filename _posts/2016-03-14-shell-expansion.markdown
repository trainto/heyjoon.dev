---
layout: post
title: "Shell expansion"
tags:
- shell expansion
- linux
- bash
---
Usually I've been using shell expansion without any notion. However I though it would be meaningful to wrap things up. 'Shell expansion' can be divided into 8 types, and detailed explanation can be founded [here](http://tldp.org/LDP/Bash-Beginners-Guide/html/sect_03_04.html).
<br />


### Brace expansion
Used to generate arbitrary strings.

~~~shell
> echo {1..10}
1 2 3 4 5 6 7 8 9 10

> echo {a..d}
a b c d

> echo {1..10..2}
1 3 5 7 9

> echo "Hello "{foo,bar}
Hello foo Hello bar
~~~
<br />


### Tilde expansion
Used to expand to several pathnames such as home directory, current working directory and previous working directory.

~~~shell
> echo ~
/home/user

> echo ~user2
/home/user2

> echo ~+
(current working directory)

> echo ~-
(previous working directory)
~~~
<br />


### Shell parameter and Variable expansion
Parameter expansion is introduced with '$' symbol. It looks like below.

${expressoin}

~~~shell
> str1=hello
> str2=foo
> str3=bar
> echo ${str1}
hello

> echo ${str2}
foo

> echo ${str3}
bar
~~~
<br />


### Command substitution
Command substitution allows the output of a command to replace the command itself. It comes with '$' symbol and parenthesis like below.

$(cmds)

~~~shell
> echo $(date)
Mon Mar 14 00:12:57 PDT 2016
~~~
<br />


### Arithmetic expansion
Arithmetic expansion allows the evaluation of an arithmetic expression and the substitution of the result. It comes with '$' symbol and double parenthesis.

~~~shell
> $((num1=1,num2=2,num3=num1*num2))
2: command not found

> echo $((num1=1,num2=2,num3=num1*num2))
2
~~~
<br />


### Process substitution
Process substitution is supported on systems that support named pipes or the /dev/fd method of naming open files. It comes with pipeline expression '>', '<' and parenthesis.

~~~shell
# Note 3 commands following show the same result
> echo <(ls)
/dev/fd/63

> echo >(cat)
/dev/fd/63

> echo /dev/fd/63
/dev/fd/63

> cat -vte < <(echo -e "$IFS")
^I$
~~~
<br />


### Word splitting
the results of parameter expansion, command substitution, and arithmetic expansion that did not occur within double quotes will be applied to word splitting by 'IFS' value. The default 'IFS' values are sequences of <space>, <tab>, and <newline>.

If you want to check IFS value, you can do this,

~~~shell
> set | grep "IFS"
IFS=$' \t\n'
~~~
<br />


### File name expansion
After word splitting, Bash scans each word for the characters '\*', '?', and '['.

See [here](https://www.gnu.org/software/bash/manual/html_node/Pattern-Matching.html#Pattern-Matching) for Pattern-Matching. And note that it does not use Regular Expression.

~~~shell
> ls
a b c

> *
a: command not found

> echo *
a b c
~~~

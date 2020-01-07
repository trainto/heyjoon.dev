---
title: 'Vim 8'
date: '2017-01-05'
---

Vim 8.0 is released!! I know it might be quite old news, but I've found it today. :( Recently I don't use vim as much as before(mostly AndroidStudio and Atom), but it's still the best editor for me to edit simple text files, and source code quickly in shell environment.

It's been about 10 years since Vim updated, and finally you can grab the new version. This version includes a lot of small features, bug fixes, and some major highlights.

- Asynchronous I/O support, channels, JSON
- Jobs
- Timers
- Partials, Lambdas and Closures
- Packages
- New style testing
- Viminfo merged by timestamp
- GTK+ 3 support
- MS-Windows DirectX support

<br>
If you want more detail, visit below link:

[VIM REFERENCE MANUAL by Bram Moolenaar](https://raw.githubusercontent.com/vim/vim/master/runtime/doc/version8.txt)

So, let's find out how to install it on your Mac. It can be updated simply by homebrew.

```shell
brew install vim --with-override-system-vi
```

That's it!!

Or you can consider [MacVim](http://macvim-dev.github.io/macvim/).

```shell
brew install macvim
brew linkapps
```

<br>
To execute MacVim in terminal mode,

```shell
mvim -v
```

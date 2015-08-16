import frida
session =frida.attach("cat")
print([x.name for x in session.enumerate_modules()])
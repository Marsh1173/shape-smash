X Physics
X Basic controls
X Basic platforms
X Camera
X Asset loading
X Good-looking platforms
X Multiplayer
X Rig
X Server controller
X Health UI
X Death
X Rezzing
X Client input cleanup
X Sprite data separation
X Death animation
X Animation framework + jump and move animation
X Basic dummy portal objects
X Damage animation
X Basic ability system

Ability component

> Make generic dynamic position component
>
> > Queueing velocity animations? Based on difference from last position
> > Dash ability requires generic position

State update + routing cleanup
Combat animation
Interactions
Server stages and main stage sleep

BUGS

> Sometimes reaching ledges only processes on client's side
>
> > Maybe sync server when client's on_ground changes?

> Player clips through platform when focusing / unfocusing page

X Fix bug where a player doesn't build another player loading in at the same time

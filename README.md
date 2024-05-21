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
X Ability component
X Make generic dynamic position component
X - Queueing velocity animations? Based on difference from last position
X - Dash ability requires generic position
X Server is authority on position
X Test ping delay
X - Meh. Needs polish. Correct by rig position, not entity position. Make sure you're on Ciaglo

More abilities + polish
Combat animation
State update + routing cleanup + controller cleanup
Interactions
Server stages and main stage sleep

BUGS

> Sometimes reaching ledges only processes on client's side
>
> > Maybe sync server when client's on_ground changes?

> Player clips through platform when focusing / unfocusing page

X Fix bug where a player doesn't build another player loading in at the same time

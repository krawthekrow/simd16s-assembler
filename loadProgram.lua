local sx, sy, filename = ...

if filename == nil then
	filename = "program.bin"
end

local lineno = 0
for line in io.lines(filename) do
	if lineno >= 64 * 16 then
		tpt.log("Program too large.")
		break
	end
	local cx = sx + lineno % 64
	local cy = sy + math.floor(lineno / 64)
	local cid = sim.partID(cx,cy)
	if cid ~= nil and sim.partProperty(cid, sim.FIELD_TYPE) == elements.DEFAULT_PT_FILT then
		sim.partProperty(cid, sim.FIELD_CTYPE, tonumber(line, 2))
	else
		tpt.log("Cannot set ctype at point "..tostring(cx)..", "..tostring(cy))
	end
	lineno = lineno + 1
end
tpt.log(lineno)

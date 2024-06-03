local radio = {}
local prop = 0
VC = exports['V-Core']:getCoreObject()

RegisterNetEvent("Vlore-Radio:OpenRadio", function(data, slot)
	local restricionAccess = data.name == 'radio' and true or false
	if radio.showUI then
		switchRadioFocus(false)
	else
		switchRadioFocus(true, not restricionAccess)
	end
end)


function switchRadioFocus(bool, restriction)
	local animDict, animAnim = Config.animDict, Config.animAnim
	SetNuiFocus(bool, bool)
    SetNuiFocusKeepInput(bool)
	radio.showUI = bool
	if bool then
		SendNuiMessage(json.encode({
			action = "showhideRadio",
			value = bool,
			restricted = restriction
		}))
	else
		SendNuiMessage(json.encode({
			action = "showhideRadio",
			value = bool,
		}))
	end

	CreateThread(function()
		if not radio.showUI then
			StopAnimTask(PlayerPedId(), animDict, animAnim, 2.0)
			DetachEntity(prop, true, false)
			DeleteEntity(prop)
			prop = 0
		end
		while radio.showUI do
			Wait(0)
			if not DoesEntityExist(prop) then
				RequestModel('prop_cs_hand_radio')
				while not HasModelLoaded('prop_cs_hand_radio') do
					Citizen.Wait(150)
				end
				prop = CreateObject('prop_cs_hand_radio', 0.0, 0.0, 0.0, true, true, false)
				AttachEntityToEntity(prop, PlayerPedId(), GetPedBoneIndex(PlayerPedId(), Config.AttachArguments.Bone), Config.AttachArguments.xPos, Config.AttachArguments.yPos, Config.AttachArguments.zPos, Config.AttachArguments.xRot, Config.AttachArguments.yRot, Config.AttachArguments.zRot,true,true, false, true, 1,true)
				TriggerEvent('ox_inventory:disarm', true)
			end
			if not IsEntityPlayingAnim(PlayerPedId(), animDict, animAnim, 3) then 
				VC.PlayAnimation(PlayerPedId(), animDict, animAnim, -1, 49)
			end
			if IsEntityDead(PlayerPedId()) then
				switchRadioFocus(false)
			end

		end
	end)
    while IsNuiFocused() do
        DisableControlAction(2, 1, true)
        DisableControlAction(2, 2, true)
        DisableControlAction(2, 13, true)
		DisableControlAction(2, 21, true)
		DisableControlAction(2, 22, true)
        DisableControlAction(2, 24, true)
        DisableControlAction(2, 200, true)
        DisableControlAction(2, 245, true)
		Wait(1)
    end
end

RegisterNUICallback('ChangeRadioVolume', function(data)
	local volume = data['volume']
	if volume == 0 then
		exports["pma-voice"]:removePlayerFromRadio(channel, true)
		exports["pma-voice"]:setRadioVolume(volume)
	else
		print(volume)
		exports["pma-voice"]:setRadioVolume(volume)
	end
end)

RegisterNUICallback('tryJoinThisChannel', function(data)
	local channel = data['channelid']
	local plyState = Player(GetPlayerServerId(PlayerId())).state
	local currentChannel = plyState.radioChannel
	local canJoin = true
	if canJoin then
		if currentChannel ~= 0 then exports["pma-voice"]:removePlayerFromRadio(currentChannel) end
		exports["pma-voice"]:addPlayerToRadio(channel, true)
	end
end)

RegisterNUICallback('hideRadio', function()
	switchRadioFocus(false)
end)

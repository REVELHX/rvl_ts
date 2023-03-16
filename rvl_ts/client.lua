ESX = nil
local ColorsTable = {}
local MyVehicle = {}
Citizen.CreateThread(function()
    while ESX == nil do
        TriggerEvent('esx:getSharedObject', function(obj)
            ESX = obj
        end)
        Citizen.Wait(10)
    end
end)


Citizen.CreateThread(function()
    while true do
        REVEL = 1000
        if #(GetEntityCoords(PlayerPedId()) - vector3(534.7, -180.61, 54.32)) < 3 then -- xd
            REVEL = 1
            -- if ESX.GetPlayerData().job.name == 'mechanic' then
            if IsPedInAnyVehicle(PlayerPedId(), true) then
                DrawMarker(20, 534.7, -180.61, 54.32, 0, 0, 0, 0, 0, 0, 0.4, 0.2, 0.2, 0, 255, 0, 255, false, false, 2,
                    1, nil, nil, false)
                if IsControlJustReleased(0, 54) then
                    local veh = GetVehiclePedIsIn(PlayerPedId(), false)

                    SetNuiFocus(true, true)
                    SendNUIMessage({
                        action = "open",
                        plate = GetVehicleNumberPlateText(veh),
                        model = GetDisplayNameFromVehicleModel(GetEntityModel(veh))
                    })
                    ColorsTable = {}
                end
            elseif IsAnyVehicleNearPoint(534.7, -180.61, 54.32, 3.5) then
                DrawMarker(20, 534.7, -180.61, 54.32, 0, 0, 0, 0, 0, 0, 0.4, 0.2, 0.2, 0, 255, 0, 255, false, false, 2,
                    1, nil, nil, false)
                if IsControlJustReleased(0, 54) then
                    local veh = GetClosestVehicle(534.7, -180.61, 54.32, 3.0, 0, 70)
                    SetNuiFocus(true, true)
                    SendNUIMessage({
                        action = "open",
                        plate = GetVehicleNumberPlateText(veh),
                        model = GetDisplayNameFromVehicleModel(GetEntityModel(veh))
                    })
                    ColorsTable = {}
                end
            end
            -- end
        end
        Citizen.Wait(REVEL)
    end
end)



RegisterNUICallback("callbacks", function(data)
    if data.action == "close" then
        SetNuiFocus(false, false)
        SendNUIMessage({
            action = "hide"
        })
    elseif data.action == "SlotSelected" then
        local veh = GetVehiclePedIsIn(PlayerPedId(), false)
        local vehColour =  table.pack(GetVehicleColours(veh))
        print(veh)
        if veh == 0 then 
            veh = GetClosestVehicle(534.7, -180.61, 54.32, 3.0, 0, 70)
        end
            if data.mod == "PrimaryColour" then 
                SetVehicleColours(veh, data.Item.index, vehColour[0])
            elseif data.mod == "SecondaryColour" then 
                SetVehicleColours(veh, vehColour[1], data.Item.index)
            end
    elseif data.action == "ModSelect" then 
      if data.mod == "PrimaryColour" then 
        ColorsTable = {}
        for k,v in pairs(Config.colors) do
            table.insert(ColorsTable, {
                type = "PrimaryColour",
                name = v.name,
                index = v.index,
                price = v.price
            }) 
        end
        SendNUIMessage({
            action = "PrimaryColour",
            table = ColorsTable
        })
    elseif data.mod == "SecondaryColour" then 
        ColorsTable = {}
        for k,v in pairs(Config.colors) do
            table.insert(ColorsTable, {
                type = "SecondaryColour",
                name = v.name,
                index = v.index,
                price = v.price
            }) 
        end
        SendNUIMessage({
            action = "SecondaryColour",
            table = ColorsTable
        })
    end
    end
end)


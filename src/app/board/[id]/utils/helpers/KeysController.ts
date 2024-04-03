import DeviceChecker, {OSType} from "@/app/board/[id]/utils/helpers/DeviceChecker";

export default class KeysController {
    getDeleteKey = () : string => {
        let device = new DeviceChecker()
        if (device.getOSType() == OSType.MacOS) {
            return 'Backspace';
        }
        return "Delete";
    }
}
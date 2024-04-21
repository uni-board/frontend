import DeviceChecker, {OSType} from "@/app/board/[id]/utils/helpers/DeviceChecker";

export default class KeysController {
    getDeleteKey = () : string => {
        let device = new DeviceChecker()
        if (device.getOSType() == OSType.MacOS) {
            return 'Backspace';
        }
        return "Delete";
    }

    getPasteCombination = () : { main: string, special: string } => {
        let device = new DeviceChecker();
        if (device.getOSType() == OSType.MacOS) {
            return {
                main: "v",
                special: "Meta",
            };
        }
        return {
            main: "v",
            special: "Control",
        };
    }

    getCopyCombination = () : { main: string, special: string } => {
        let device = new DeviceChecker();
        if (device.getOSType() == OSType.MacOS) {
            return {
                main: "c",
                special: "Meta",
            };
        }
        return {
            main: "c",
            special: "Control",
        };
    }
}
export default class Normalizer {
    // for medication objects only
    static adoptKey(medication, key) {
        medication.key = key
        return medication
    }
}
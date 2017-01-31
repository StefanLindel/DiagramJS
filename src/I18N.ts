/**
 * Created by Stefan on 18.12.2016.
 */

/*    {language}{group}*{id}{
    {
        "de-DE": {
        "translation": {
            "key1": "value of key 1 in de-DE",
                value
            "friend_male": "A boyfriend",
                "friend_female": "A girlfriend",
                "friend_male_plural": "{{count}} boyfriends",
                "friend_female_plural": "{{count}} girlfriends"
        }
*/
//noinspection JSUnusedGlobalSymbols
export class I18N {
    public defaultlanguage:string =  navigator.language;
    public language:string =  navigator.language;
    private values:Object={"de":{}};
    public addKeyValue(key:string, value:string) {

    }
    public load(json:JSON) :boolean {
        return false;
    }

    public changeLanguage(language:string) {
        if(language) {
            this.language=language;
        }
        let value:Object = this.values.hasOwnProperty(this.language);
        if(!value) {
            value = this.values.hasOwnProperty(this.defaultlanguage);
        }
        let keys:string[] = Object.keys(value);
        

    }
}

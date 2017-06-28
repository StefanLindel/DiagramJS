/**
 * Created by Stefan on 28.06.2017.
 */
import {Control} from "../../Control";
import Data from "../../Data";

export class AutoComplete extends Control {
    constructor(data: JSON) {
        super();
    }
    public load(json: JSON, owner?: Control): any {
        this.createControl(this.$owner, json);
    }
    protected createControl(parent: Control, data: JSON) {
        if (typeof(data) === 'string') {
            this.id = <string>data;
        } else {
            this.id = data['id'];
        }
        this.$view = document.createElement('div');
        <div class="k-widget k-multiselect k-header" deselectable="on" title="" style="">
            <div class="k-multiselect-wrap k-floatwrap" deselectable="on"><ul role="listbox" deselectable="on" class="k-reset"><li class="k-button ng-scope" deselectable="on"><span deselectable="on">Chai</span><span unselectable="on" aria-label="delete" class="k-select"><span class="k-icon k-i-close"></span>
            </span></li></ul>
        <input class="k-input" style="width: 25px;" accesskey="" autocomplete="off" role="listbox" title="" aria-expanded="false" tabindex="0" aria-owns="" aria-disabled="false" aria-busy="false" aria-activedescendant="4c045e38-6bbd-4ef1-b5ed-59a96d9b57ee"><span deselectable="on" class="k-icon k-clear-value k-i-close" title="clear" role="button" tabindex="-1"></span><span class="k-icon k-i-loading k-hidden"></span></div><select kendo-multi-select="" k-options="selectOptions" k-ng-model="selectedIds" k-value-primitive="false" data-role="multiselect" multiple="multiple" aria-disabled="false" style="display: none;"><option value="1" selected="">Chai</option><option value="2">Chang</option><option value="3">Aniseed Syrup</option><option value="4">Chef Anton's Cajun Seasoning</option><option value="5">Chef Anton's Gumbo Mix</option><option value="6">Grandma's Boysenberry Spread</option><option value="7">Uncle Bob's Organic Dried Pears</option><option value="8">Northwoods Cranberry Sauce</option><option value="9">Mishi Kobe Niku</option><option value="10">Ikura</option><option value="11">Queso Cabrales</option><option value="12">Queso Manchego La Pastora</option><option value="13">Konbu</option><option value="14">Tofu</option><option value="15">Genen Shouyu</option><option value="16">Pavlova</option><option value="17">Alice Mutton</option><option value="18">Carnarvon Tigers</option><option value="19">Teatime Chocolate Biscuits</option><option value="20">Sir Rodney's Marmalade</option><option value="21">Sir Rodney's Scones</option><option value="22">Gustaf's Knäckebröd</option><option value="23">Tunnbröd</option><option value="24">Guaraná Fantástica</option><option value="25">NuNuCa Nuß-Nougat-Creme</option><option value="26">Gumbär Gummibärchen</option><option value="27">Schoggi Schokolade</option><option value="28">Rössle Sauerkraut</option><option value="29">Thüringer Rostbratwurst</option><option value="30">Nord-Ost Matjeshering</option><option value="31">Gorgonzola Telino</option><option value="32">Mascarpone Fabioli</option><option value="33">Geitost</option><option value="34">Sasquatch Ale</option><option value="35">Steeleye Stout</option><option value="36">Inlagd Sill</option><option value="37">Gravad lax</option><option value="38">Côte de Blaye</option><option value="39">Chartreuse verte</option><option value="40">Boston Crab Meat</option><option value="41">Jack's New England Clam Chowder</option><option value="42">Singaporean Hokkien Fried Mee</option><option value="43">Ipoh Coffee</option><option value="44">Gula Malacca</option><option value="45">Rogede sild</option><option value="46">Spegesild</option><option value="47">Zaanse koeken</option><option value="48">Chocolade</option><option value="49">Maxilaku</option><option value="50">Valkoinen suklaa</option><option value="51">Manjimup Dried Apples</option><option value="52">Filo Mix</option><option value="53">Perth Pasties</option><option value="54">Tourtière</option><option value="55">Pâté chinois</option><option value="56">Gnocchi di nonna Alice</option><option value="57">Ravioli Angelo</option><option value="58">Escargots de Bourgogne</option><option value="59">Raclette Courdavault</option><option value="60">Camembert Pierrot</option><option value="61">Sirop d'érable</option><option value="62">Tarte au sucre</option><option value="63">Vegie-spread</option><option value="64">Wimmers gute Semmelknödel</option><option value="65">Louisiana Fiery Hot Pepper Sauce</option><option value="66">Louisiana Hot Spiced Okra</option><option value="67">Laughing Lumberjack Lager</option><option value="68">Scottish Longbreads</option><option value="69">Gudbrandsdalsost</option><option value="70">Outback Lager</option><option value="71">Flotemysost</option><option value="72">Mozzarella di Giovanni</option><option value="73">Röd Kaviar</option><option value="74">Longlife Tofu</option><option value="75">Rhönbräu Klosterbier</option><option value="76">Lakkalikööri</option><option value="77">Original Frankfurter grüne Soße</option></select><span style="font-family: Arial; font-size: 13.3333px; font-stretch: normal; font-style: normal; font-weight: normal; letter-spacing: normal; text-transform: none; line-height: 17.4667px; position: absolute; visibility: hidden; top: -3333px; left: -3333px;"></span></div>
    class="k-multiselect-wrap k-floatwrap"

        this.$view = document.createElement('button');
        if (data instanceof Object) {
            for (let attr in data) {
                if (!data.hasOwnProperty(attr)) {
                    continue;
                }
                this.$view.setAttribute(attr, data[attr]);
            }
        }
        parent.appendChild(this);
    }
}
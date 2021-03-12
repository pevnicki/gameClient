<template>
  <div class="container">

    <div class="side-panel">
      <h1>Score Board</h1>
      <ul  v-bind:class = "isReached ? 'winner':'' ">
        <li v-for="(house, index) in sortHouses" :key="index">
          {{ house.name }} : {{ house.score }}
        </li>
      </ul>
      <div class="mt-20">
        <h2>Updates</h2>

          <ul>
            <li v-for="(update, index) in updates" :key="index">
              House <b>{{ update.house.name }}</b> has moved {{ update.house.strength }}
              and gained {{ update.house.score }} length
            </li>
          </ul>

      </div>
    </div>

    <world-map :houses="houses"></world-map>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import WorldMap from '@/components/WorldMap.vue';
import {Component, Vue, Watch} from 'vue-property-decorator';
import House from '@/models/House';
import {IPoint} from '@/models/IPoint';
import {IUpdate} from '@/models/IUpdate';

@Component({
  name: 'Home',
  components: {WorldMap: WorldMap},
})
export default class Home extends Vue {

  isReached = false

  created() {
    this.$store.dispatch('initUpdates');
    this.$store.dispatch('getHouses');
  }

  /**
   * watch for updates
   * TODO: move houses according to updates.
   * @param latestUpdate
   */
  @Watch('latestUpdate')
  onNewUpdate(latestUpdate: IUpdate) {
    const x2 = this.kingsLandingPosition.x
    const y2 = this.kingsLandingPosition.y

    const step = latestUpdate.steps
    if (step === 0) return;

    const house: House = latestUpdate.house
    const x1 = house.position.x
    const y1 = house.position.y
    const newPosition = this.calcNewPosition(x1, y1, x2, y2, step);

    house.position.x = newPosition.x
    house.position.y = newPosition.y
    house.score = house.score + latestUpdate.score

    this.$store.commit('updateHouse', house)

    if (this.isReached) {
      this.calcWinner(house)
    }


  }

  /**
   * TODO: calculate the new position
   * @param x1 house x position
   * @param y1 house y position
   * @param x2 destination x position
   * @param y2 destination y position
   * @param length number of steps towards destination
   */
  calcNewPosition(x1: number, y1: number, x2: number, y2: number, length: number): IPoint {
    /**
     * @param D distance between two points
     */
    const D: number = Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2))
    console.log(D, length)
    if (D === 0 && D <=20 ) {
      this.isReached = true;
      return {
        x: x2, y: y2
      }
    }
    const x3 = Math.round(x1 + (length / D) * (x2 - x1))
    const y3 = Math.round(y1 + (length / D) * (y2 - y1))

    return {
      x: x3, y: y3
    }
  }

  /**
   * TODO: calculate the winner
   * @param house the house fighting the Lannisters
   */
  calcWinner(house: House): House {

    const bestHouse = this.houses.reduce((prev, current) => {
      return (prev.score > current.score) ? prev : current
    })

    this.$store.commit('setWinner', bestHouse)
    alert(bestHouse.name)
    return new House()
  }


  /* ------ STORE GETTERS ------ */


  getHouseByName(name: string): House {
    return this.$store.getters.houseByName(name);
  }

  get houses(): House[] {
    return this.$store.getters.houses;
  }

  get updates() {
    return this.$store.getters.updates;
  }

  get latestUpdate() {
    return this.$store.getters.latestUpdate;
  }

  get kingsLandingPosition(): IPoint {
    return this.$store.getters.kingsLandingPosition;
  }

  get sortHouses(): House[] {
    const houses = this.houses
    return houses.sort((a, b) => (a.score < b.score) ? 1 : ((b.score < a.score) ? -1 : 0))
  }

}
</script>

<style lang="scss">
$map-width: calc(1280px * 1.115);
.container {
  display: flex;

  .side-panel {
    padding: 20px;
    min-width: 360px;
    width: calc(100% - #{$map-width} - 40px);
    text-align: left;

    .winner:first-child{
      font-weight: bold;
    }

    ul {
      list-style: none;

      li {
        padding: 5px;
      }

    }

    ul.updates {
      text-decoration: underline;
    }
    .mt-20{

      ul{
        height: 30rem;
        overflow: auto;
      }
    }
  }
}
</style>

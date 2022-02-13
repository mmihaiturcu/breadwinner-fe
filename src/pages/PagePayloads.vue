<style scoped lang="scss">
@import 'src/css/quasar.variables.scss';

$list-header-height: 48px;

.card-list-container {
    padding: 16px;
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: $list-header-height auto;
    gap: 10px;
    overflow-x: hidden;
    overflow-y: auto;
}

.list-header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0px 5px;
    position: sticky;
    top: 18px;
    left: 0;
    background: white;
    border-radius: 4px;
    box-shadow: map-get($map: $elevation-umbra-shadow-map, $key: 2) $elevation-umbra-shadow-color,
        map-get($map: $elevation-penumbra-shadow-map, $key: 2) $elevation-penumbra-shadow-color,
        map-get($map: $elevation-ambient-shadow-map, $key: 2) $elevation-ambient-shadow-color;
}

.card-list {
    display: grid;
    gap: 10px;
    padding: 18px;
    justify-content: center;
}
</style>

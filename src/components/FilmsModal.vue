<template>
    <dialog id="my_modal_2" class="modal">
        <div class="modal-box">
            <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <h3 class="text-lg font-bold">Select a poster</h3>
            <div class="grid grid-cols-4 gap-2 p-4">
                <div class="aspect-2/3">
                    <img onclick="my_modal_2.showModal()" class="border-1 rounded-sm cursor-pointer" src="https://image.tmdb.org/t/p/original/sRITPlHYjHiOLQXr0sFxVz5TPmj.jpg"></img>
                </div>
            </div>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>
</template>
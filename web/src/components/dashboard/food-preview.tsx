export default function FoodPreview() {
    return(
        <section className="text-center my-16">
            <p className="text-2xl italic opacity-80 mb-8">Plan. Cook. Eat. Feel Good.</p>

            <div className="flex justify-center gap-8">
            <img src="/placeholder.png" alt="Food preview" className="w-[18rem] h-[13rem] object-cover rounded-3xl shadow-[0_0.2rem_1rem_rgba(0,0,0,0.2)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_1rem_2rem_rgba(0,0,0,0.2)]"></img>
            <img src="/placeholder.png" alt="Food preview" className="w-[18rem] h-[13rem] object-cover rounded-3xl shadow-[0_0.2rem_1rem_rgba(0,0,0,0.2)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_1rem_2rem_rgba(0,0,0,0.2)]"></img>
            <img src="/placeholder.png" alt="Food preview" className="w-[18rem] h-[13rem] object-cover rounded-3xl shadow-[0_0.2rem_1rem_rgba(0,0,0,0.2)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_1rem_2rem_rgba(0,0,0,0.2)]"></img>
            </div>
        </section>
    )
}